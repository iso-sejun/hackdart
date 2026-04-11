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

module.exports = {
  lookupPickupOptions,
};
