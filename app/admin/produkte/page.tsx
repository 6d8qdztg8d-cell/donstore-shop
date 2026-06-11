import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Image from "next/image";

export default async function AdminProdukte() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const products = await prisma.product.findMany({
    include: { images: { where: { isPrimary: true } }, _count: { select: { orderItems: true } } },
    orderBy: { createdAt: "desc" },
  }).catch(() => []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black tracking-tight">Produkte</h1>
        <button className="bg-black text-white text-sm font-semibold px-5 py-2.5 hover:bg-gray-800 transition-colors cursor-pointer">
          + Neues Produkt
        </button>
      </div>
      <div className="bg-white border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {["Produkt", "Preis", "Lager", "Verkäufe", "Status"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 flex-shrink-0 overflow-hidden">
                      {p.images[0] && (
                        <Image src={p.images[0].url} alt={p.name} width={40} height={40} className="w-full h-full object-contain" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-gray-400">{p.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">{p.price.toFixed(2).replace(".", ",")} €</td>
                <td className="px-4 py-3">
                  <span className={p.stock < 10 ? "text-red-500 font-medium" : ""}>{p.stock}</span>
                </td>
                <td className="px-4 py-3">{p._count.orderItems}×</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${p.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {p.active ? "Aktiv" : "Inaktiv"}
                  </span>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-gray-400">Noch keine Produkte</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
