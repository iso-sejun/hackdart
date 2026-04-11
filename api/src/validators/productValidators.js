function createValidationError(message, field) {
  const error = new Error(message);
  error.statusCode = 400;
  error.code = 'VALIDATION_ERROR';
  error.details = field ? { field } : null;
  return error;
}

function validateRequiredString(value, field, minLength = 1) {
  if (typeof value !== 'string' || value.trim().length < minLength) {
    throw createValidationError(`${field} is required`, field);
  }
}

function validateImageUrls(images) {
  if (!Array.isArray(images) || images.length === 0) {
    throw createValidationError('images must contain at least one image URL', 'images');
  }

  images.forEach((image, index) => {
    if (typeof image !== 'string' || !image.trim()) {
      throw createValidationError(`images.${index} must be a valid URL`, `images.${index}`);
    }
  });
}

function validateProductPayload(req, _res, next) {
  try {
    const {
      name,
      description,
      category,
      images,
      unit,
      price,
      quantityAvailable,
      minimumOrderQty,
      status,
    } = req.body;

    if (req.method === 'POST' || name !== undefined) {
      validateRequiredString(name, 'name', 2);
    }

    if (req.method === 'POST' || description !== undefined) {
      validateRequiredString(description, 'description', 5);
    }

    if (category !== undefined && typeof category !== 'string') {
      throw createValidationError('category must be a string', 'category');
    }

    if (req.method === 'POST' || images !== undefined) {
      validateImageUrls(images);
    }

    const allowedUnits = ['lb', 'bunch', 'item', 'basket'];
    if (req.method === 'POST' || unit !== undefined) {
      if (!allowedUnits.includes(unit)) {
        throw createValidationError('unit is invalid', 'unit');
      }
    }

    if (req.method === 'POST' || price !== undefined) {
      if (typeof price !== 'number' || Number.isNaN(price) || price <= 0) {
        throw createValidationError('price must be a number greater than 0', 'price');
      }
    }

    if (req.method === 'POST' || quantityAvailable !== undefined) {
      if (!Number.isInteger(quantityAvailable) || quantityAvailable < 0) {
        throw createValidationError(
          'quantityAvailable must be an integer greater than or equal to 0',
          'quantityAvailable'
        );
      }
    }

    if (minimumOrderQty !== undefined) {
      if (!Number.isInteger(minimumOrderQty) || minimumOrderQty < 1) {
        throw createValidationError(
          'minimumOrderQty must be an integer greater than or equal to 1',
          'minimumOrderQty'
        );
      }
    }

    const allowedStatuses = ['active', 'inactive', 'sold_out', 'archived'];
    if (status !== undefined && !allowedStatuses.includes(status)) {
      throw createValidationError('status is invalid', 'status');
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  validateProductPayload,
};
