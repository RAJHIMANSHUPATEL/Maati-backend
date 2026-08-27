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

## Local database + seed

The previous Atlas database is left untouched. For local work the API uses MongoDB at `mongodb://127.0.0.1:27017/ecom_pos`.

1. Start MongoDB locally.
2. Confirm `MONGO_URL` in `.env` is `mongodb://127.0.0.1:27017/ecom_pos`.
3. Seed demo data (refuses to run against a remote or non-`ecom_pos` database):

```bash
npm run seed
```

Demo logins:

- CRM: `admin@greenfarm.test` / `Admin@123`
- Website: `customer@greenfarm.test` / `Customer@123`
- Coupons: `FARM10` (Noida 10%), `FLAT50` (Noida ₹50), `WELCOME20` (Delhi 20%)

Point website and CRM `VITE_IMAGE_URL` at `http://localhost:5001/uploads/` so seed placeholders load.

## Environment

See `.env.example`. Use `EMAIL_USER` / `EMAIL_PASS` (or `MAIL_ID` / `MAIL_PASSWORD`) for OTP mail. Set `CORS_ORIGINS` to the website and CRM origins in production.

## Deploy

1. Provision MongoDB and Cloudinary.
2. Set production env vars (`JWT_SECRET`, `API_TOKEN`, `CORS_ORIGINS`, SMTP, Cloudinary).
3. Run `npm start`.
4. Point the website `VITE_API_URL` at `/api/ecommerce` and the CRM at `/api/admin`.

## Smoke checklist

- CRM login, create/edit a product, set stock
- Website: pick store, search, apply coupon, place COD order
- CRM: order appears, status can be updated
- Website `/orders` shows the order
- Forgot password sends OTP
