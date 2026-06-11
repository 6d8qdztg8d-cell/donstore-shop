"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const NAV = [
  { href: "/admin",              label: "Dashboard",      icon: "▦" },
  { href: "/admin/bestellungen", label: "Bestellungen",   icon: "📦" },
  { href: "/admin/produkte",     label: "Produkte",       icon: "👟" },
  { href: "/admin/kunden",       label: "Kunden",         icon: "👤" },
  { href: "/admin/rabattcodes",  label: "Rabattcodes",    icon: "🏷" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="w-56 bg-black text-white min-h-screen flex flex-col">
      <div className="px-6 py-6 border-b border-gray-800">
        <p className="font-black text-lg tracking-tight">DONSTORE</p>
        <p className="text-xs text-gray-400 mt-0.5">Admin</p>
      </div>
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {NAV.map((item) => {
            const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded transition-colors ${
                    active ? "bg-white text-black font-semibold" : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      {session && (
        <div className="px-4 py-4 border-t border-gray-800">
          <p className="text-xs text-gray-400 truncate mb-3">{session.user?.email}</p>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="text-xs text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            Abmelden →
          </button>
        </div>
      )}
    </aside>
  );
}
