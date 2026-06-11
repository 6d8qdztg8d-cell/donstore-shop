"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) { setError("Ungültige Anmeldedaten."); return; }
    router.push("/admin");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white border border-gray-200 p-8">
        <h1 className="text-2xl font-black tracking-tight mb-2">DONSTORE</h1>
        <p className="text-sm text-gray-500 mb-8">Admin-Bereich</p>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1.5">E-Mail</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1.5">Passwort</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400" />
          </div>
          {error && <p className="text-red-500 text-sm" role="alert">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-black text-white font-semibold py-3 text-sm hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-60">
            {loading ? "Anmelden..." : "Anmelden"}
          </button>
        </form>
      </div>
    </div>
  );
}
