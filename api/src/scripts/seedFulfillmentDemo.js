require('../config/env');

const bcrypt = require('bcryptjs');

const connectToDatabase = require('../config/db');
const BuyerProfile = require('../models/BuyerProfile');
const FoodBank = require('../models/FoodBank');
const Order = require('../models/Order');
const OrderGroup = require('../models/OrderGroup');
const Product = require('../models/Product');
const SellerProfile = require('../models/SellerProfile');
const User = require('../models/User');

const buyers = [
  {
    email: 'buyer.one@hackdart.space',
    password: 'Password123!',
    fullName: 'Avery Walker',
    phone: '603-555-0311',
    address: {
      line1: '12 School St',
      line2: '',
      city: 'Hanover',
      state: 'NH',
      postalCode: '03755',
      country: 'US',
    },
  },
  {
    email: 'buyer.two@hackdart.space',
    password: 'Password123!',
    fullName: 'Jordan Lee',
    phone: '603-555-0312',
    address: {
      line1: '80 Main St',
      line2: '',
      city: 'Hanover',
      state: 'NH',
      postalCode: '03755',
      country: 'US',
    },
  },
];

function makeOrderNumber(index) {
  return `ORD-DEMO${String(index + 1).padStart(3, '0')}`;
}

async function ensureBuyerRecord(seed) {
  let user = await User.findOne({ email: seed.email });

  if (!user) {
    user = await User.create({
      email: seed.email,
      passwordHash: await bcrypt.hash(seed.password, 10),
      role: 'buyer',
    });
  }

  await BuyerProfile.findOneAndUpdate(
    { userId: user._id },
    {
      $set: {
        userId: user._id,
        fullName: seed.fullName,
        phone: seed.phone,
        defaultAddress: seed.address,
        pickupRadiusMiles: 5,
        eligibilityMode: 'self_attested',
        eligibilityStatus: 'approved',
      },
    },
    { upsert: true, new: true }
  );

  return user;
}

async function seedFulfillmentDemo() {
  await connectToDatabase();

  const sellerProfile = await SellerProfile.findOne({ email: 'seller@hackdart.space' });
  const foodBank = await FoodBank.findOne({ name: 'Food Bank X' });
  const products = await Product.find({ sellerId: sellerProfile?.userId }).limit(3);

  if (!sellerProfile || !foodBank || products.length < 2) {
    throw new Error(
      'Missing seller, food bank, or products. Run seed:foodbanks and seed:marketplace first.'
    );
  }

  const buyerUsers = [];
  for (const buyer of buyers) {
    buyerUsers.push(await ensureBuyerRecord(buyer));
  }

  await Order.deleteMany({ sellerId: sellerProfile.userId });
  await OrderGroup.deleteMany({ buyerId: { $in: buyerUsers.map((user) => user._id) } });

  for (let index = 0; index < buyerUsers.length; index += 1) {
    const buyer = buyerUsers[index];
    const productA = products[index % products.length];
    const productB = products[(index + 1) % products.length];
    const items = [
      {
        productId: productA._id,
        sellerId: sellerProfile.userId,
        productNameSnapshot: productA.name,
        imageSnapshot: productA.images[0] || '',
        unit: productA.unit,
        quantity: 2 + index,
        unitPrice: productA.price,
        lineTotal: Number(((2 + index) * productA.price).toFixed(2)),
      },
      {
        productId: productB._id,
        sellerId: sellerProfile.userId,
        productNameSnapshot: productB.name,
        imageSnapshot: productB.images[0] || '',
        unit: productB.unit,
        quantity: 1,
        unitPrice: productB.price,
        lineTotal: Number(productB.price.toFixed(2)),
      },
    ];

    const subtotal = Number(items.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2));

    const orderGroup = await OrderGroup.create({
      buyerId: buyer._id,
      orderNumber: makeOrderNumber(index),
      status: 'confirmed',
      paymentStatus: 'paid',
      fulfillmentStatus: 'pending',
      pickupAddressSnapshot: buyers[index].address,
      selectedFoodBankId: foodBank._id,
      selectedFoodBankSnapshot: {
        name: foodBank.name,
        email: foodBank.email,
        address: foodBank.address,
      },
      itemsSnapshot: items,
      subtotal,
      paymentProcessingFee: 0,
      platformFee: 0,
      total: subtotal,
      paidAt: new Date(),
    });

    await Order.create({
      orderGroupId: orderGroup._id,
      buyerId: buyer._id,
      sellerId: sellerProfile.userId,
      foodBankId: foodBank._id,
      status: 'confirmed',
      paymentStatus: 'paid',
      fulfillmentStatus: 'pending',
      items: items.map((item) => ({
        productId: item.productId,
        productNameSnapshot: item.productNameSnapshot,
        imageSnapshot: item.imageSnapshot,
        quantity: item.quantity,
        unit: item.unit,
        unitPrice: item.unitPrice,
        lineTotal: item.lineTotal,
      })),
      sellerSubtotal: subtotal,
      buyerTotal: subtotal,
    });
  }

  console.log(`Seeded ${buyerUsers.length} demo fulfillment orders for seller ${sellerProfile.farmName}`);
  process.exit(0);
}

seedFulfillmentDemo().catch((error) => {
  console.error('Failed to seed fulfillment demo:', error);
  process.exit(1);
});
