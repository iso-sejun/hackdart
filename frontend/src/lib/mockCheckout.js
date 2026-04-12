export function getDemoPickupOptions(address = {}) {
  return [
    {
      id: null,
      name: 'Upper Valley Community Food Bank',
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
      name: 'White River Junction Family Food Pantry',
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
