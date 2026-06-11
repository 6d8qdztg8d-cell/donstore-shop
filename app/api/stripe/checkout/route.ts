import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { CartItem } from "@/lib/cart-store";

export async function POST(req: NextRequest) {
  try {
    const { items, discountCode, discountAmount } = await req.json() as {
      items: CartItem[];
      discountCode: string;
      discountAmount: number;
    };

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Warenkorb ist leer" }, { status: 400 });
    }

    const lineItems = items.map((item: CartItem) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name + (item.size ? ` (${item.size})` : ""),
          images: [item.image],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.qty,
    }));

    // Shipping line item if under 60 €
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    if (subtotal < 60) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: { name: "Versand", images: [] },
          unit_amount: 499,
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "paypal"],
      line_items: lineItems,
      mode: "payment",
      locale: "de",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/warenkorb`,
      metadata: {
        discountCode: discountCode ?? "",
        discountAmount: String(discountAmount ?? 0),
      },
      shipping_address_collection: { allowed_countries: ["DE", "AT", "CH"] },
      billing_address_collection: "required",
      phone_number_collection: { enabled: false },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: "Checkout fehlgeschlagen" }, { status: 500 });
  }
}
