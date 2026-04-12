const fulfillmentService = require('../services/fulfillmentService');

async function listSellerBatches(req, res, next) {
  try {
    const batches = await fulfillmentService.listSellerBatches(req.auth.sub);

    res.json({
      data: {
        batches,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function getSellerBatch(req, res, next) {
  try {
    const batch = await fulfillmentService.getSellerBatch(req.auth.sub, req.params.batchId);

    res.json({
      data: batch,
    });
  } catch (error) {
    next(error);
  }
}

async function markBatchShipped(req, res, next) {
  try {
    const result = await fulfillmentService.markBatchShipped(req.auth.sub, req.params.batchId);

    res.json({
      data: {
        success: true,
        status: result.batch.status,
        batch: result.batch,
        email: result.email,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listSellerBatches,
  getSellerBatch,
  markBatchShipped,
};
