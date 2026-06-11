import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function AdminRabattcodes() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const codes = await prisma.discountCode.findMany({
    orderBy: { createdAt: "desc" },
  }).catch(() => []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black tracking-tight">Rabattcodes</h1>
        <button className="bg-black text-white text-sm font-semibold px-5 py-2.5 hover:bg-gray-800 transition-colors cursor-pointer">
          + Neuer Code
        </button>
      </div>
      <div className="bg-white border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {["Code", "Typ", "Wert", "Min. Bestellung", "Verwendet", "Status"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {codes.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono font-bold">{c.code}</td>
                <td className="px-4 py-3">{c.type === "PERCENTAGE" ? "Prozent" : "Fix"}</td>
                <td className="px-4 py-3">{c.type === "PERCENTAGE" ? `${c.value}%` : `${c.value.toFixed(2)} €`}</td>
                <td className="px-4 py-3">{c.minOrder ? `${c.minOrder.toFixed(2)} €` : "–"}</td>
                <td className="px-4 py-3">{c.usedCount}{c.maxUses ? `/${c.maxUses}` : ""}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${c.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {c.active ? "Aktiv" : "Deaktiviert"}
                  </span>
                </td>
              </tr>
            ))}
            {codes.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-400">Keine Rabattcodes</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
