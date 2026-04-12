const express = require('express');

const corsMiddleware = require('./middleware/cors');
const requestContext = require('./middleware/requestContext');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const healthRouter = require('./routes/health');
const authRouter = require('./routes/auth');
const sellerRouter = require('./routes/sellers');
const productRouter = require('./routes/products');
const cartRouter = require('./routes/cart');
const pickupRouter = require('./routes/pickup');
const buyerRouter = require('./routes/buyers');
const checkoutRouter = require('./routes/checkout');
const stripeWebhookRouter = require('./routes/stripeWebhook');
const foodBankRouter = require('./routes/foodBank');

const app = express();

app.use(corsMiddleware);
app.use('/api/v1/webhooks/stripe', express.raw({ type: 'application/json' }), stripeWebhookRouter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestContext);

app.use('/api/v1', healthRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/sellers', sellerRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/pickup', pickupRouter);
app.use('/api/v1/buyers', buyerRouter);
app.use('/api/v1/checkout', checkoutRouter);
app.use('/api/v1/food-bank', foodBankRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
