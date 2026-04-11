const FoodBank = require('../models/FoodBank');
const { geocodeAddress } = require('../lib/demoGeocoder');

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
    pickupOptions: foodBanks.map((foodBank) => ({
      id: foodBank._id,
      name: foodBank.name,
      email: foodBank.email,
      phone: foodBank.phone,
      address: foodBank.address,
      hours: foodBank.hours,
      contactName: foodBank.contactName,
      coordinates: foodBank.geo.coordinates,
    })),
  };
}

module.exports = {
  lookupFoodBanks,
};
