# ETHEREALMARKET

Premium simulated digital-goods marketplace (school project demo).

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- React Router
- Supabase-ready (Auth + Postgres). Runs fully in **local demo mode** without Supabase using browser storage.

## Quick start (GitHub Codespaces / local)

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
npm run preview
```

## Demo credentials (local mode)

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@etherealmarket.demo` | `AdminDemo123!` |
| Customer | Register any email | min 6 characters |

Local mode stores users, cart, orders, and deposits in `localStorage`. No secrets are committed.

## Environment

Copy `.env.example` to `.env`:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_WALLET_BTC=
VITE_WALLET_USDT_TRC20=
VITE_WALLET_USDT_ERC20=
VITE_WALLET_ETH=
```

Without Supabase vars the app uses local demo auth. Wallet addresses are **public deposit addresses only** — never put private keys or seed phrases in the frontend or repo.

## Supabase setup

1. Create a project and run `supabase/schema.sql` in the SQL editor.
2. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. Register a user, then set `profiles.role = 'admin'` for that user in the dashboard.

## Features

- Auth (login / register / session)
- Customer dashboard with balance, cart, deposit, orders, support
- Marketplace: 363 synthetic listings, search + multi-filters
- Product cards show catalog fields only (BIN, country, brand, type, level, issuer, price)
- Manual crypto deposit + checkout (admin approve/reject)
- Protected admin panel: products, orders, deposits, users, settings

## Notes

This is a **simulation for educational presentation**. Catalog data is synthetic. No real payment-card PAN/CVV/expiry data is stored or displayed.
