import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const STATUS_LABELS: Record<string, string> = {
  OPEN: "Offen", PAID: "Bezahlt", PROCESSING: "In Bearbeitung",
  SHIPPED: "Versendet", COMPLETED: "Abgeschlossen", CANCELLED: "Storniert",
};

export default async function AdminBestellungen() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const orders = await prisma.order.findMany({
    include: { customer: true, items: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  }).catch(() => []);

  return (
    <div>
      <h1 className="text-2xl font-black tracking-tight mb-8">Bestellungen</h1>
      <div className="bg-white border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {["Bestellung", "Datum", "Kunde", "Artikel", "Status", "Gesamt"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs font-medium">{o.orderNumber}</td>
                <td className="px-4 py-3 text-gray-500">{new Date(o.createdAt).toLocaleDateString("de-DE")}</td>
                <td className="px-4 py-3">{o.customer.firstName} {o.customer.lastName}<br/><span className="text-xs text-gray-400">{o.customer.email}</span></td>
                <td className="px-4 py-3">{o.items.length} Artikel</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                    o.status === "PAID" ? "bg-green-100 text-green-700" :
                    o.status === "SHIPPED" ? "bg-blue-100 text-blue-700" :
                    o.status === "CANCELLED" ? "bg-red-100 text-red-700" :
                    "bg-gray-100 text-gray-600"
                  }`}>
                    {STATUS_LABELS[o.status]}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold">{o.total.toFixed(2).replace(".", ",")} €</td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-400">Noch keine Bestellungen</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
