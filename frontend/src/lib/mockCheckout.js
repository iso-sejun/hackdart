const BUYER_STORAGE_KEY = 'hackdart_mock_orders';
const SELLER_BATCH_STORAGE_KEY = 'hackdart_mock_seller_batches';

function readStorage(key) {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (_error) {
    return [];
  }
}

function writeStorage(key, value) {
  if (typeof window === 'undefined') {
    return value;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
  return value;
}

export function getDemoPickupOptions(address = {}) {
  return [
    {
      id: 'demo-food-bank-x',
      name: 'Food Bank X',
      hours: 'Mon-Fri 9am-5pm',
      contactName: 'Riley Hart',
      address: {
        line1: '101 Elm St',
        city: address.city || 'Hanover',
        state: address.state || 'NH',
        postalCode: '03755',
        country: address.country || 'US',
      },
    },
    {
      id: 'demo-food-bank-y',
      name: 'Food Bank Y',
      hours: 'Tue-Sat 10am-4pm',
      contactName: 'Morgan Lee',
      address: {
        line1: '44 School St',
        city: 'Lebanon',
        state: 'NH',
        postalCode: '03766',
        country: address.country || 'US',
      },
    },
  ];
}

export function readMockOrders() {
  return readStorage(BUYER_STORAGE_KEY);
}

export function readMockSellerBatches() {
  return readStorage(SELLER_BATCH_STORAGE_KEY);
}

function writeMockOrders(orders) {
  return writeStorage(BUYER_STORAGE_KEY, orders);
}

function writeMockSellerBatches(batches) {
  return writeStorage(SELLER_BATCH_STORAGE_KEY, batches);
}

function aggregateItems(items) {
  const byProduct = new Map();

  for (const item of items) {
    const key = `${item.productId}-${item.unit}`;
    const current = byProduct.get(key) || {
      productId: item.productId,
      productNameSnapshot: item.productName,
      totalQuantity: 0,
      unit: item.unit,
    };

    current.totalQuantity = Number((current.totalQuantity + item.quantity).toFixed(2));
    byProduct.set(key, current);
  }

  return Array.from(byProduct.values());
}

function createSellerBatchFromOrder(order) {
  return {
    id: `mock-batch-${order.orderGroupId}`,
    status: 'ready_to_ship',
    shippedAt: null,
    manifestSentAt: null,
    orderCount: order.orders.length,
    aggregatedItems: aggregateItems(order.orders.flatMap((entry) => entry.items)),
    seller: {
      id: 'demo-seller',
      farmName: 'Demo Seller Hangar',
      contactName: 'HackDart Demo Farm',
    },
    foodBank: order.foodBank,
    orders: order.orders.map((entry) => ({
      id: entry.orderId,
      orderGroupId: order.orderGroupId,
      orderNumber: order.orderNumber,
      buyerId: 'demo-buyer',
      buyerName: 'Demo Buyer',
      status: entry.status,
      items: entry.items.map((item) => ({
        productId: item.productId,
        productNameSnapshot: item.productName,
        quantity: item.quantity,
        unit: item.unit,
        lineTotal: item.lineTotal,
      })),
      buyerTotal: order.total,
      createdAt: order.createdAt,
    })),
  };
}

function upsertMockSellerBatch(order) {
  const batches = readMockSellerBatches();
  const nextBatch = createSellerBatchFromOrder(order);
  const existingIndex = batches.findIndex((batch) => batch.id === nextBatch.id);

  if (existingIndex >= 0) {
    batches[existingIndex] = nextBatch;
  } else {
    batches.unshift(nextBatch);
  }

  writeMockSellerBatches(batches);
  return nextBatch;
}

export function saveMockOrder(order) {
  const nextOrders = [order, ...readMockOrders()];
  writeMockOrders(nextOrders);
  upsertMockSellerBatch(order);
  return order;
}

export function createMockOrder({ summary, foodBank }) {
  const timestamp = Date.now();
  const orderGroupId = `mock-${timestamp}`;
  const orderNumber = `ORD-MOCK-${String(timestamp).slice(-6)}`;

  return saveMockOrder({
    orderGroupId,
    orderNumber,
    status: 'confirmed',
    paymentStatus: 'paid',
    fulfillmentStatus: 'pending',
    total: summary.total,
    createdAt: new Date().toISOString(),
    foodBank: {
      id: foodBank.id,
      name: foodBank.name,
      address: foodBank.address,
      email: foodBank.email || 'pickup@hackdart.demo',
      contactName: foodBank.contactName || 'Demo Hub Team',
    },
    orders: [
      {
        orderId: `order-${orderGroupId}`,
        status: 'confirmed',
        paymentStatus: 'paid',
        fulfillmentStatus: 'pending',
        items: summary.items.map((item) => ({
          productId: item.productId,
          productName: item.name,
          quantity: item.quantity,
          unit: item.unit,
          unitPrice: item.unitPrice,
          lineTotal: item.lineTotal,
          imageUrl: item.imageUrl || '',
        })),
      },
    ],
  });
}

export function getMockSellerBatch(batchId) {
  return readMockSellerBatches().find((batch) => batch.id === batchId) || null;
}

export function markMockSellerBatchShipped(batchId) {
  const now = new Date().toISOString();
  const nextBatches = readMockSellerBatches().map((batch) => {
    if (batch.id !== batchId) {
      return batch;
    }

    return {
      ...batch,
      status: 'shipped',
      shippedAt: now,
      manifestSentAt: now,
      orders: batch.orders.map((order) => ({
        ...order,
        status: 'shipped',
      })),
    };
  });

  writeMockSellerBatches(nextBatches);
  return nextBatches.find((batch) => batch.id === batchId) || null;
}
