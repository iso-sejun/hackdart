const productService = require('../services/productService');

function serializeProduct(product) {
  return {
    id: product._id,
    sellerId: product.sellerId,
    name: product.name,
    slug: product.slug,
    description: product.description,
    category: product.category,
    images: product.images,
    unit: product.unit,
    price: product.price,
    quantityAvailable: product.quantityAvailable,
    minimumOrderQty: product.minimumOrderQty,
    status: product.status,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

async function listMarketplaceProducts(req, res, next) {
  try {
    const products = await productService.searchMarketplaceProducts(req.query.search);

    res.json({
      data: {
        products: products.map(serializeProduct),
      },
    });
  } catch (error) {
    next(error);
  }
}

async function listSellerProducts(req, res, next) {
  try {
    const products = await productService.listSellerProducts(req.auth.sub);

    res.json({
      data: {
        products: products.map(serializeProduct),
      },
    });
  } catch (error) {
    next(error);
  }
}

async function createProduct(req, res, next) {
  try {
    const product = await productService.createProduct(req.auth.sub, req.body);

    res.status(201).json({
      data: serializeProduct(product),
    });
  } catch (error) {
    next(error);
  }
}

async function updateProduct(req, res, next) {
  try {
    const product = await productService.updateProduct(req.auth.sub, req.params.productId, req.body);

    res.json({
      data: serializeProduct(product),
    });
  } catch (error) {
    next(error);
  }
}

async function deleteProduct(req, res, next) {
  try {
    await productService.deleteProduct(req.auth.sub, req.params.productId);

    res.json({
      data: {
        success: true,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listMarketplaceProducts,
  listSellerProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
