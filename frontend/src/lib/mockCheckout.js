export function getDemoPickupOptions(address = {}) {
  return [
    {
      id: null,
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
      id: null,
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
