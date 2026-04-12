require('../config/env');

const connectToDatabase = require('../config/db');
const FoodBank = require('../models/FoodBank');

const foodBanks = [
  {
    name: 'Upper Valley Community Food Bank',
    email: 'hello@foodbankx.org',
    phone: '603-555-0101',
    address: {
      line1: '101 Elm St',
      line2: '',
      city: 'Hanover',
      state: 'NH',
      postalCode: '03755',
      country: 'US',
    },
    geo: {
      type: 'Point',
      coordinates: [-72.2875, 43.7011],
    },
    acceptingOrders: true,
    hours: 'Mon-Fri 9am-5pm',
    contactName: 'Riley Hart',
  },
  {
    name: 'White River Junction Family Food Pantry',
    email: 'pickup@foodbanky.org',
    phone: '603-555-0142',
    address: {
      line1: '44 School St',
      line2: '',
      city: 'Lebanon',
      state: 'NH',
      postalCode: '03766',
      country: 'US',
    },
    geo: {
      type: 'Point',
      coordinates: [-72.2522, 43.6434],
    },
    acceptingOrders: true,
    hours: 'Tue-Sat 10am-4pm',
    contactName: 'Morgan Lee',
  },
  {
    name: 'Upper Valley Community Pantry',
    email: 'team@uppervalleypantry.org',
    phone: '802-555-0193',
    address: {
      line1: '8 Depot St',
      line2: '',
      city: 'White River Junction',
      state: 'VT',
      postalCode: '05001',
      country: 'US',
    },
    geo: {
      type: 'Point',
      coordinates: [-72.3192, 43.6488],
    },
    acceptingOrders: true,
    hours: 'Mon-Sat 8am-6pm',
    contactName: 'Avery Stone',
  },
];

async function seedFoodBanks() {
  await connectToDatabase();
  await FoodBank.deleteMany({});
  await FoodBank.insertMany(foodBanks);

  console.log(`Seeded ${foodBanks.length} food banks`);
  process.exit(0);
}

seedFoodBanks().catch((error) => {
  console.error('Failed to seed food banks:', error);
  process.exit(1);
});
