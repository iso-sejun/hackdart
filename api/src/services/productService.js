const Product = require('../models/Product');
const SellerProfile = require('../models/SellerProfile');

function createSlug(name) {
  return `${name}`
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function ensureSellerProfile(userId) {
  const profile = await SellerProfile.findOne({ userId });

  if (!profile) {
    const error = new Error('Seller profile not found');
    error.statusCode = 404;
    error.code = 'SELLER_PROFILE_NOT_FOUND';
    throw error;
  }

  return profile;
}

async function createUniqueSlug(name, currentProductId = null) {
  const baseSlug = createSlug(name) || 'product';
  let attempt = baseSlug;
  let suffix = 1;

  while (true) {
    const existingProduct = await Product.findOne({
      slug: attempt,
      ...(currentProductId ? { _id: { $ne: currentProductId } } : {}),
    });

    if (!existingProduct) {
      return attempt;
    }

    suffix += 1;
    attempt = `${baseSlug}-${suffix}`;
  }
}

function normalizeStatus(quantityAvailable, requestedStatus) {
  if (quantityAvailable === 0) {
    return 'sold_out';
  }

  return requestedStatus || 'active';
}

async function listSellerProducts(userId) {
  await ensureSellerProfile(userId);

  return Product.find({ sellerId: userId }).sort({ createdAt: -1 });
}

async function listMarketplaceProducts() {
  return Product.find({
    status: { $in: ['active', 'sold_out'] },
  }).sort({ createdAt: -1 });
}

async function searchMarketplaceProducts(query) {
  const filter = {
    status: { $in: ['active', 'sold_out'] },
  };

  if (query) {
    filter.$or = [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { category: { $regex: query, $options: 'i' } },
    ];
  }

  return Product.find(filter).sort({ createdAt: -1 });
}

async function createProduct(userId, payload) {
  await ensureSellerProfile(userId);

  const product = await Product.create({
    sellerId: userId,
    name: payload.name,
    slug: await createUniqueSlug(payload.name),
    description: payload.description,
    category: payload.category || 'produce',
    images: payload.images || [],
    unit: payload.unit,
    price: payload.price,
    quantityAvailable: payload.quantityAvailable,
    minimumOrderQty: payload.minimumOrderQty || 1,
    status: normalizeStatus(payload.quantityAvailable, payload.status),
  });

  return product;
}

async function updateProduct(userId, productId, payload) {
  const product = await Product.findOne({ _id: productId, sellerId: userId });

  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    error.code = 'PRODUCT_NOT_FOUND';
    throw error;
  }

  const editableFields = [
    'name',
    'description',
    'category',
    'images',
    'unit',
    'price',
    'quantityAvailable',
    'minimumOrderQty',
    'status',
  ];

  editableFields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(payload, field)) {
      product[field] = payload[field];
    }
  });

  if (Object.prototype.hasOwnProperty.call(payload, 'name')) {
    product.slug = await createUniqueSlug(payload.name, product._id);
  }

  product.status = normalizeStatus(product.quantityAvailable, product.status);

  await product.save();
  return product;
}

async function deleteProduct(userId, productId) {
  const product = await Product.findOneAndDelete({ _id: productId, sellerId: userId });

  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    error.code = 'PRODUCT_NOT_FOUND';
    throw error;
  }

  return product;
}

module.exports = {
  listSellerProducts,
  listMarketplaceProducts,
  searchMarketplaceProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
