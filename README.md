# Maati backend

Node.js + Express + MongoDB API for the Maati website and CRM.

## Run

```bash
npm install
cp .env.example .env
npm run dev
```

The API listens on `PORT` (default 5001).

- Website: `/api/ecommerce`
- CRM: `/api/admin`
- POS till: `/api/pos`

## Local database + seed

The previous Atlas database is left untouched. For local work the API uses MongoDB at `mongodb://127.0.0.1:27017/ecom_pos`.

1. Start MongoDB locally.
2. Confirm `MONGO_URL` in `.env` is `mongodb://127.0.0.1:27017/ecom_pos`.
3. Seed demo data (refuses to run against a remote or non-`ecom_pos` database):

```bash
npm run seed
```

Demo logins:

- CRM owner: `admin@greenfarm.test` / `Admin@123`
- CRM manager (Noida): `ops@greenfarm.test` / `Admin@123`
- Website: `customer@greenfarm.test` / `Customer@123`
- POS till: `NOIDA T1` / `1234` (or `DELHI T1` / `1234`) at `http://localhost:5175`
- POS sign-on: Noida `1001` / `1111`, Delhi `1002` / `1111`, manager `2001` / `1111`

Point website and CRM `VITE_IMAGE_URL` at `http://localhost:5001/uploads/` so seed placeholders load.

## Environment

See `.env.example`. Real values go in gitignored `.env` (local) and `.env.demo` (Render). `APP_ENV` is `development`, `demo`, or `production`. SMTP is optional; skip it unless you need website OTP.

## Deploy

The API is a long-running Node process (Render free for demo). Frontends go to Vercel. Full steps: [DEPLOY.md](../DEPLOY.md).

## Smoke checklist

- CRM login, create/edit a product, set stock
- Website: pick store, search, apply coupon, place COD order
- CRM: order appears, status can be updated
- Website `/orders` shows the order
- POS: unlock till, cash sale, reprint, void same day
- Forgot password sends OTP
