import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY ?? "re_placeholder");
}

interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: { name: string; size?: string; qty: number; price: number }[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  address: string;
}

function formatPrice(n: number) {
  return n.toFixed(2).replace(".", ",") + " €";
}

function buildOrderTable(items: OrderEmailData["items"]) {
  return items
    .map(
      (i) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">${i.name}${i.size ? ` (${i.size})` : ""}</td>
          <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;text-align:center;">${i.qty}</td>
          <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;text-align:right;">${formatPrice(i.price * i.qty)}</td>
        </tr>`
    )
    .join("");
}

export async function sendOrderConfirmationToCustomer(data: OrderEmailData) {
  await getResend().emails.send({
    from: "Donstore <bestellungen@donstore.de>",
    to: data.customerEmail,
    subject: `Deine Donstore Bestellung #${data.orderNumber} ist eingegangen`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#fff;padding:32px;">
        <h1 style="font-size:24px;font-weight:700;margin-bottom:8px;">Danke für deine Bestellung!</h1>
        <p style="color:#6b7280;margin-bottom:24px;">Hi ${data.customerName}, deine Bestellung wurde erfolgreich aufgenommen.</p>
        <div style="background:#f9fafb;padding:16px;border-radius:8px;margin-bottom:24px;">
          <p style="font-weight:600;margin-bottom:4px;">Bestellnummer: <span style="color:#111;">#${data.orderNumber}</span></p>
        </div>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
          <thead>
            <tr style="border-bottom:2px solid #e5e7eb;">
              <th style="text-align:left;padding:8px 0;">Produkt</th>
              <th style="text-align:center;padding:8px 0;">Menge</th>
              <th style="text-align:right;padding:8px 0;">Preis</th>
            </tr>
          </thead>
          <tbody>${buildOrderTable(data.items)}</tbody>
        </table>
        <div style="text-align:right;margin-bottom:24px;">
          <p>Zwischensumme: ${formatPrice(data.subtotal)}</p>
          <p>Versand: ${data.shippingCost === 0 ? "Kostenlos" : formatPrice(data.shippingCost)}</p>
          ${data.discount > 0 ? `<p>Rabatt: -${formatPrice(data.discount)}</p>` : ""}
          <p style="font-weight:700;font-size:18px;">Gesamt: ${formatPrice(data.total)}</p>
        </div>
        <div style="background:#f9fafb;padding:16px;border-radius:8px;margin-bottom:24px;">
          <p style="font-weight:600;margin-bottom:4px;">Lieferadresse</p>
          <p style="color:#374151;">${data.address}</p>
        </div>
        <p style="color:#6b7280;font-size:14px;">Bei Fragen erreichst du uns unter support@donstore.de</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;"/>
        <p style="color:#9ca3af;font-size:12px;">© 2025 Donstore Performance Lab</p>
      </div>
    `,
  });
}

export async function sendOrderNotificationToAdmin(data: OrderEmailData) {
  await getResend().emails.send({
    from: "Donstore System <system@donstore.de>",
    to: process.env.ADMIN_EMAIL!,
    subject: `🛒 Neue Donstore Bestellung #${data.orderNumber} – ${formatPrice(data.total)}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <h1>Neue Bestellung #${data.orderNumber}</h1>
        <p><strong>Kunde:</strong> ${data.customerName} (${data.customerEmail})</p>
        <p><strong>Adresse:</strong> ${data.address}</p>
        <p><strong>Gesamt:</strong> ${formatPrice(data.total)}</p>
        <h3>Produkte</h3>
        <ul>${data.items.map((i) => `<li>${i.name}${i.size ? ` (${i.size})` : ""} × ${i.qty} = ${formatPrice(i.price * i.qty)}</li>`).join("")}</ul>
      </div>
    `,
  });
}
