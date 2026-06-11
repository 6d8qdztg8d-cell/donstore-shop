import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationToCustomer, sendOrderNotificationToAdmin } from "@/lib/email";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Webhook signature error:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    await handleCheckoutComplete(session);
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const shippingDetails = session.shipping_details;
  const customerDetails = session.customer_details;
  if (!customerDetails?.email) return;

  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { expand: ["data.price.product"] });

  const orderNumber = `DS-${Date.now().toString(36).toUpperCase()}`;
  const total = (session.amount_total ?? 0) / 100;
  const subtotal = lineItems.data.reduce((s, i) => {
    if ((i.price?.product as Stripe.Product)?.name === "Versand") return s;
    return s + (i.amount_total ?? 0) / 100;
  }, 0);
  const shippingCost = total - subtotal + Number(session.metadata?.discountAmount ?? 0);
  const discount = Number(session.metadata?.discountAmount ?? 0);

  const nameParts = (shippingDetails?.name ?? customerDetails.name ?? "").split(" ");
  const firstName = nameParts[0] ?? "Unbekannt";
  const lastName = nameParts.slice(1).join(" ") || "-";

  const customer = await prisma.customer.upsert({
    where: { email: customerDetails.email },
    update: {},
    create: {
      email: customerDetails.email,
      firstName,
      lastName,
      phone: customerDetails.phone ?? undefined,
      street: shippingDetails?.address?.line1 ?? "",
      city: shippingDetails?.address?.city ?? "",
      zip: shippingDetails?.address?.postal_code ?? "",
      country: shippingDetails?.address?.country ?? "DE",
    },
  });

  const orderItems = lineItems.data
    .filter((i) => (i.price?.product as Stripe.Product)?.name !== "Versand")
    .map((i) => ({
      qty: i.quantity ?? 1,
      price: (i.price?.unit_amount ?? 0) / 100,
      name: i.description ?? "",
    }));

  const order = await prisma.order.create({
    data: {
      orderNumber,
      status: "PAID",
      subtotal,
      shippingCost: Math.max(0, shippingCost),
      discount,
      total,
      stripeSessionId: session.id,
      stripePaymentId: session.payment_intent as string,
      discountCode: session.metadata?.discountCode ?? undefined,
      customerId: customer.id,
      items: { create: orderItems },
    },
  });

  const emailData = {
    orderNumber: order.orderNumber,
    customerName: `${customer.firstName} ${customer.lastName}`,
    customerEmail: customer.email,
    items: orderItems,
    subtotal,
    shippingCost: Math.max(0, shippingCost),
    discount,
    total,
    address: `${customer.street}, ${customer.zip} ${customer.city}, ${customer.country}`,
  };

  await Promise.all([
    sendOrderConfirmationToCustomer(emailData).catch(console.error),
    sendOrderNotificationToAdmin(emailData).catch(console.error),
  ]);
}
