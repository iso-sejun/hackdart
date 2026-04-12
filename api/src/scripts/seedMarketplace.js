require('../config/env');

const bcrypt = require('bcryptjs');

const connectToDatabase = require('../config/db');
const Product = require('../models/Product');
const SellerProfile = require('../models/SellerProfile');
const User = require('../models/User');

const sellerEmail = 'seller@hackdart.space';

const sellerProfileSeed = {
  farmName: 'Astro-Grown Farms',
  contactName: 'Nova Fields',
  phone: '603-555-0202',
  email: sellerEmail,
  farmAddress: {
    line1: '77 Harvest Loop',
    line2: '',
    city: 'Lebanon',
    state: 'NH',
    postalCode: '03766',
    country: 'US',
  },
  description: 'Hydroponic produce grown under warm orbital grow rails.',
  foodSafetyAttested: true,
  foodSafetyAttestedAt: new Date(),
  foodSafetyTermsVersion: 'v1',
};

const productSeeds = [
  {
    name: 'Cosmic Cherry Tomatoes',
    slug: 'cosmic-cherry-tomatoes',
    description: 'Sweet and juicy hydroponic tomatoes for pickup-day bundles.',
    category: 'organic fruit',
    images: ['https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=900&q=80'],
    unit: 'basket',
    price: 4.99,
    quantityAvailable: 30,
    minimumOrderQty: 1,
    status: 'active',
  },
  {
    name: 'Leafy Greens',
    slug: 'leafy-greens',
    description: 'Tender greenhouse greens grown under a purple night cycle.',
    category: 'leafy greens',
    images: ['https://images.unsplash.com/photo-1515356956468-8733193425c6?auto=format&fit=crop&w=900&q=80'],
    unit: 'basket',
    price: 4.99,
    quantityAvailable: 24,
    minimumOrderQty: 1,
    status: 'active',
  },
  {
    name: 'Herbs and Microgreens',
    slug: 'herbs-and-microgreens',
    description: 'Bright basil, parsley, and microgreen blends for fresh meals.',
    category: 'herbs & microgreens',
    images: ['https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?auto=format&fit=crop&w=900&q=80'],
    unit: 'basket',
    price: 4.99,
    quantityAvailable: 20,
    minimumOrderQty: 1,
    status: 'active',
  },
  {
    name: 'Root Vegetable Mix',
    slug: 'root-vegetable-mix',
    description: 'Orbit-grown carrots, radishes, and roots packed for pickup.',
    category: 'root vegetables',
    images: ['https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=900&q=80'],
    unit: 'basket',
    price: 5.49,
    quantityAvailable: 18,
    minimumOrderQty: 1,
    status: 'active',
  },
];

async function seedMarketplace() {
  await connectToDatabase();

  let seller = await User.findOne({ email: sellerEmail });

  if (!seller) {
    seller = await User.create({
      email: sellerEmail,
      passwordHash: await bcrypt.hash('Password123!', 10),
      role: 'seller',
    });
  }

  await SellerProfile.findOneAndUpdate(
    { userId: seller._id },
    {
      $set: {
        userId: seller._id,
        ...sellerProfileSeed,
      },
    },
    { upsert: true, new: true }
  );

  await Product.deleteMany({ sellerId: seller._id });
  await Product.insertMany(
    productSeeds.map((product) => ({
      ...product,
      sellerId: seller._id,
    }))
  );

  console.log(`Seeded ${productSeeds.length} marketplace products for ${sellerEmail}`);
  process.exit(0);
}

seedMarketplace().catch((error) => {
  console.error('Failed to seed marketplace:', error);
  process.exit(1);
});
