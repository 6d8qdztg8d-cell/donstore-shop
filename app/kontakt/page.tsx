"use client";

import { useState } from "react";
import type { Metadata } from "next";

export default function KontaktPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-4xl font-black tracking-tight mb-3">Kontakt</h1>
      <p className="text-gray-500 mb-12">Hast du Fragen oder Anregungen? Wir helfen dir gerne weiter.</p>

      {sent ? (
        <div className="bg-green-50 border border-green-200 p-6 text-center">
          <p className="font-semibold text-green-700 mb-1">Nachricht gesendet!</p>
          <p className="text-sm text-green-600">Wir melden uns so schnell wie möglich bei dir.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1.5">Name <span className="text-red-500">*</span></label>
            <input id="name" required value={name} onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 px-3 py-3 text-sm focus:outline-none focus:border-gray-400" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1.5">E-Mail <span className="text-red-500">*</span></label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 px-3 py-3 text-sm focus:outline-none focus:border-gray-400" />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1.5">Nachricht <span className="text-red-500">*</span></label>
            <textarea id="message" required rows={5} value={message} onChange={(e) => setMessage(e.target.value)}
              className="w-full border border-gray-200 px-3 py-3 text-sm focus:outline-none focus:border-gray-400 resize-none" />
          </div>
          <button type="submit" className="bg-black text-white font-semibold px-8 py-3.5 text-sm hover:bg-gray-800 transition-colors cursor-pointer">
            Nachricht senden →
          </button>
        </form>
      )}

      <div className="mt-16 pt-10 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div>
          <p className="font-semibold mb-2">E-Mail</p>
          <a href="mailto:support@donstore.de" className="text-gray-500 hover:text-black text-sm">support@donstore.de</a>
        </div>
        <div>
          <p className="font-semibold mb-2">Antwortzeit</p>
          <p className="text-gray-500 text-sm">Werktags innerhalb von 24 Stunden</p>
        </div>
      </div>
    </div>
  );
}
