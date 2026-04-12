const pickupService = require('../services/pickupService');

async function lookupPickupOptions(req, res, next) {
  try {
    const result = await pickupService.lookupFoodBanks(req.body);

    res.json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

async function getDemoPickupOptions(_req, res, next) {
  try {
    const foodBanks = await pickupService.ensureDemoFoodBanks();

    res.json({
      data: {
        pickupOptions: foodBanks.map(pickupService.serializeFoodBank),
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  lookupPickupOptions,
  getDemoPickupOptions,
};
