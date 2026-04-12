# HackDart

HackDart is a space-themed produce marketplace built for a hackathon. The platform is designed to solve two problems at once:

- farms lose money when good produce never leaves the field
- low-income households struggle to afford fresh, healthy food

HackDart connects those two sides through a shared pickup model:

1. buyers order discounted farm produce
2. orders are grouped by food bank hub
3. sellers ship one combined batch to the food bank
4. the food bank prepares household pickup orders

The result is a marketplace where farmers recover value from surplus inventory and households get better access to healthy food.

## Tech Stack

- Frontend: Next.js, React, Tailwind CSS
- Backend: Express.js
- Database: MongoDB Atlas
- Auth: JWT-based session flow
- Email: Nodemailer / SMTP
- Payments: Stripe package is present, but the current hackathon flow uses a simplified demo checkout path

## Repo Structure

```text
hackdart/
  api/        Express API, Mongo models, auth, cart, checkout, fulfillment
  frontend/   Next.js app, themed UI, dashboards, marketplace, mission pages
```

## Current Product Areas

- Landing page / ship navigation
- Login and registration
- Marketplace
- Cart and checkout
- Buyer dashboard and order tracking
- Seller dashboard, products, grouped batches, shipment flow
- Mission page

## Local Development

### 1. Install dependencies

In one terminal:

```bash
cd /Users/jacesung/Desktop/HackDartmouth/hackdart/api
npm install
```

In another terminal:

```bash
cd /Users/jacesung/Desktop/HackDartmouth/hackdart/frontend
npm install
```

### 2. Configure environment variables

Copy the example env files and fill them in:

```bash
cd /Users/jacesung/Desktop/HackDartmouth/hackdart/api
cp .env.example .env
```

```bash
cd /Users/jacesung/Desktop/HackDartmouth/hackdart/frontend
cp .env.example .env.local
```

#### Required backend env vars

From `/Users/jacesung/Desktop/HackDartmouth/hackdart/api/.env.example`:

- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `CLIENT_ORIGIN`
- `API_BASE_URL`

Optional / integration env vars:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `EMAIL_FROM`

#### Required frontend env vars

From `/Users/jacesung/Desktop/HackDartmouth/hackdart/frontend/.env.example`:

- `NEXT_PUBLIC_API_BASE_URL`

Example:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api/v1
```

### 3. Start the API

```bash
cd /Users/jacesung/Desktop/HackDartmouth/hackdart/api
npm run dev
```

The API runs on `http://localhost:4000`.

### 4. Start the frontend

```bash
cd /Users/jacesung/Desktop/HackDartmouth/hackdart/frontend
npm run dev
```

The frontend runs on `http://localhost:3000`.

## Useful Scripts

### API

From `/Users/jacesung/Desktop/HackDartmouth/hackdart/api`:

```bash
npm run dev
npm start
npm run seed:foodbanks
npm run seed:marketplace
npm run seed:fulfillment-demo
```

### Frontend

From `/Users/jacesung/Desktop/HackDartmouth/hackdart/frontend`:

```bash
npm run dev
npm run build
npm run start
```

## Seed Data / Demo Helpers

The API includes seed scripts for hackathon demos:

- `seed:foodbanks` creates pickup hubs
- `seed:marketplace` adds sample marketplace products
- `seed:fulfillment-demo` creates sample fulfillment-ready seller data

These are useful if you want to quickly demo:

- buyer browsing
- cart and checkout
- seller grouped batches
- shipped -> ready-for-pickup flow

## Email Setup

Shipment manifests and ready-for-pickup links use SMTP through Nodemailer.

For quick hackathon use, Gmail App Password SMTP works well:

- `SMTP_HOST=smtp.gmail.com`
- `SMTP_PORT=465`
- `SMTP_SECURE=true`
- `SMTP_USER=your-email@gmail.com`
- `SMTP_PASS=your-16-char-app-password`
- `EMAIL_FROM=your-email@gmail.com`

## Deployment

### Frontend

Deploy the `frontend/` app to Vercel as a Next.js project.

Set:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain/api/v1
```

### Backend

Deploy the `api/` app separately to a Node host such as Render.

Important env vars in production:

- `MONGODB_URI`
- `JWT_SECRET`
- `CLIENT_ORIGIN`
- `API_BASE_URL`
- SMTP vars if you want real email sending

## Demo Flow

Typical judge/demo path:

1. register or login as a buyer
2. browse the marketplace
3. add products to cart
4. choose a pickup hub at checkout
5. place an order
6. login as a seller
7. open grouped seller batches
8. mark a batch as shipped
9. use the emailed ready-for-pickup link
10. verify the buyer sees `ready for pickup`

## Notes

- The UI is heavily themed around a spaceship / greenhouse-in-space metaphor.
- `Why Us` has been merged into the Mission flow; `/why-us` redirects to `/mission`.
- The current project favors demo-readiness and product storytelling over production-hardening.

## License

This repository currently has no custom project license defined beyond the package defaults.
