import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

async function getStats() {
  try {
    const [orderCount, revenue, customerCount, productCount] = await Promise.all([
      prisma.order.count({ where: { status: { not: "CANCELLED" } } }),
      prisma.order.aggregate({ where: { status: { in: ["PAID", "PROCESSING", "SHIPPED", "COMPLETED"] } }, _sum: { total: true } }),
      prisma.customer.count(),
      prisma.product.count({ where: { active: true } }),
    ]);
    return { orderCount, revenue: revenue._sum.total ?? 0, customerCount, productCount };
  } catch {
    return { orderCount: 0, revenue: 0, customerCount: 0, productCount: 0 };
  }
}

async function getRecentOrders() {
  try {
    return await prisma.order.findMany({
      include: { customer: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    });
  } catch { return []; }
}

const STATUS_LABELS: Record<string, string> = {
  OPEN: "Offen", PAID: "Bezahlt", PROCESSING: "In Bearbeitung",
  SHIPPED: "Versendet", COMPLETED: "Abgeschlossen", CANCELLED: "Storniert",
};

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const [stats, recentOrders] = await Promise.all([getStats(), getRecentOrders()]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-tight">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Willkommen zurück, {session.user?.name ?? session.user?.email}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Bestellungen", value: stats.orderCount, unit: "" },
          { label: "Umsatz", value: stats.revenue.toFixed(2).replace(".", ","), unit: " €" },
          { label: "Kunden", value: stats.customerCount, unit: "" },
          { label: "Produkte", value: stats.productCount, unit: "" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 p-5">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">{s.label}</p>
            <p className="text-3xl font-black">{s.value}{s.unit}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-bold">Letzte Bestellungen</h2>
          <a href="/admin/bestellungen" className="text-sm text-gray-500 hover:text-black underline">Alle ansehen</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nr.</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Kunde</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Gesamt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{order.orderNumber}</td>
                  <td className="px-4 py-3">{order.customer.firstName} {order.customer.lastName}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                      order.status === "PAID" ? "bg-green-100 text-green-700" :
                      order.status === "SHIPPED" ? "bg-blue-100 text-blue-700" :
                      order.status === "CANCELLED" ? "bg-red-100 text-red-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {STATUS_LABELS[order.status] ?? order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">{order.total.toFixed(2).replace(".", ",")} €</td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">Noch keine Bestellungen</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
