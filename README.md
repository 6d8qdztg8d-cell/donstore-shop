# Donstore Shop

Vollständiger Next.js E-Commerce Shop für Donstore Grip Socks.

## Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4**
- **PostgreSQL** + **Prisma ORM**
- **Stripe** Checkout + Webhooks
- **NextAuth** (Credentials) für Admin-Login
- **Resend** für automatische E-Mails
- **Zustand** für Cart-State

---

## Setup

### 1. Abhängigkeiten installieren

```bash
npm install
```

### 2. Umgebungsvariablen

```bash
cp .env.example .env
```

`.env` ausfüllen (alle Werte erforderlich):

```
DATABASE_URL="postgresql://user:password@localhost:5432/donstore"
NEXTAUTH_SECRET="mindestens-32-zeichen-secret"
NEXTAUTH_URL="http://localhost:3000"
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
RESEND_API_KEY="re_..."
ADMIN_EMAIL="admin@donstore.de"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 3. Datenbank

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Dev starten

```bash
npm run dev
```

→ http://localhost:3000

---

## Admin

http://localhost:3000/admin/login

Nach Seed: `admin@donstore.de` / `admin123!` — **sofort ändern!**

---

## Stripe Webhooks (lokal)

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

## Build & Deploy

```bash
npm run build && npm run start
```

**Vercel:** Repo verknüpfen → Env-Vars eintragen → Deploy.

---

## Test-Checkliste

- [ ] Warenkorb: Artikel hinzufügen, Menge ändern, entfernen
- [ ] Rabattcode: `WELCOME10` (10%) oder `SPORT5` (5€)
- [ ] Stripe: Karte `4242 4242 4242 4242`, Datum 12/34, CVC 123
- [ ] Bestellung erscheint in Admin-Dashboard
- [ ] E-Mail-Bestätigung kommt an
- [ ] Admin-Login geschützt
- [ ] Mobile Navigation funktioniert
- [ ] Build fehlerfrei (`npm run build`)

---

> **Rechtlich:** Impressum, Datenschutz, AGB = Platzhalter. Vor Launch rechtlich prüfen lassen.
