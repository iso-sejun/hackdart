# Hyperion

Hyperion is a celestial theme produce marketplace built for a hackathon. The platform is designed to solve three problems at once:

- food waste for farms
- lost profit for farmers
- lack of access to fresh produce to low-income households.


Hyperion connects those two sides through a shared pickup model:

1. buyers order discounted farm produce
2. orders are grouped by food bank hub
3. sellers ship one combined batch to the food bank
4. the food bank prepares household pickup orders

The result is a marketplace where farmers recover value from surplus inventory and households get better access to healthy food.

## Tech Stack

Next.js, React, and Tailwind CSS for the frontend
Express.js for backend 
MongoDB Atlas for the database 
JWT authentication
Nodemailer/SMTP for email
Stripe for payments (current hackathon flow uses a simplified demo checkout path)

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
