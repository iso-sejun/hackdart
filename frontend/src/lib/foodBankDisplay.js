const FOOD_BANK_NAME_MAP = {
  'Food Bank X': 'Upper Valley Community Food Bank',
  'Food Bank Y': 'White River Junction Family Food Pantry',
};

export function getDisplayFoodBankName(name) {
  if (!name) {
    return name;
  }

  return FOOD_BANK_NAME_MAP[name] || name;
}

export function withDisplayFoodBank(foodBank) {
  if (!foodBank) {
    return foodBank;
  }

  return {
    ...foodBank,
    name: getDisplayFoodBankName(foodBank.name),
  };
}
