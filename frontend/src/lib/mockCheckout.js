const STORAGE_KEY = 'hackdart_mock_orders';

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
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_error) {
    return [];
  }
}

export function saveMockOrder(order) {
  if (typeof window === 'undefined') {
    return order;
  }

  const nextOrders = [order, ...readMockOrders()];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextOrders));
  return order;
}

export function createMockOrder({ summary, foodBank }) {
  const orderGroupId = `mock-${Date.now()}`;
  const orderNumber = `ORD-MOCK-${String(Date.now()).slice(-6)}`;

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
