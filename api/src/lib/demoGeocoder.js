const knownLocations = [
  {
    postalCode: '03755',
    city: 'Hanover',
    state: 'NH',
    coordinates: [-72.2896, 43.7022],
  },
  {
    postalCode: '03766',
    city: 'Lebanon',
    state: 'NH',
    coordinates: [-72.2518, 43.6423],
  },
  {
    postalCode: '05001',
    city: 'White River Junction',
    state: 'VT',
    coordinates: [-72.3187, 43.6481],
  },
  {
    postalCode: '05091',
    city: 'Woodstock',
    state: 'VT',
    coordinates: [-72.5184, 43.6242],
  },
];

function geocodeAddress(address) {
  if (!address || typeof address !== 'object') {
    return null;
  }

  const postalCode = `${address.postalCode || ''}`.trim();
  const city = `${address.city || ''}`.trim().toLowerCase();
  const state = `${address.state || ''}`.trim().toLowerCase();

  const byPostalCode = knownLocations.find((location) => location.postalCode === postalCode);

  if (byPostalCode) {
    return {
      type: 'Point',
      coordinates: byPostalCode.coordinates,
    };
  }

  const byCityState = knownLocations.find(
    (location) =>
      location.city.toLowerCase() === city && location.state.toLowerCase() === state
  );

  if (byCityState) {
    return {
      type: 'Point',
      coordinates: byCityState.coordinates,
    };
  }

  return null;
}

module.exports = {
  geocodeAddress,
};
