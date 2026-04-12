const FoodBank = require('../models/FoodBank');
const { geocodeAddress } = require('../lib/demoGeocoder');

const DEMO_FOOD_BANK_FIXTURES = [
  {
    name: 'Food Bank X',
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
    name: 'Food Bank Y',
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
];

function serializeFoodBank(foodBank) {
  return {
    id: foodBank._id,
    name: foodBank.name,
    email: foodBank.email,
    phone: foodBank.phone,
    address: foodBank.address,
    hours: foodBank.hours,
    contactName: foodBank.contactName,
    coordinates: foodBank.geo.coordinates,
  };
}

async function ensureDemoFoodBanks() {
  const results = [];

  for (const fixture of DEMO_FOOD_BANK_FIXTURES) {
    const foodBank = await FoodBank.findOneAndUpdate(
      { name: fixture.name },
      {
        $set: fixture,
      },
      {
        upsert: true,
        new: true,
      }
    );

    results.push(foodBank);
  }

  return results;
}

async function lookupFoodBanks(payload) {
  const geoPoint = geocodeAddress(payload.address);

  if (!geoPoint) {
    const error = new Error(
      'We could not match that address yet. Use a seeded Hanover, Lebanon, White River Junction, or Woodstock address for this demo.'
    );
    error.statusCode = 400;
    error.code = 'ADDRESS_NOT_FOUND';
    throw error;
  }

  const radiusMeters = payload.radiusMiles * 1609.34;

  const foodBanks = await FoodBank.find({
    acceptingOrders: true,
    geo: {
      $near: {
        $geometry: geoPoint,
        $maxDistance: radiusMeters,
      },
    },
  });

  return {
    origin: geoPoint,
    pickupOptions: foodBanks.map(serializeFoodBank),
  };
}

module.exports = {
  lookupFoodBanks,
  ensureDemoFoodBanks,
  serializeFoodBank,
};
