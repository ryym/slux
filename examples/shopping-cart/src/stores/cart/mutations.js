export const addProduct = ({ state, getters }, productId) => {
  const { addedIds, quantityById } = state;

  if (! getters.hasProduct(productId)) {
    addedIds.push(productId);
  }

  quantityById[productId] = (quantityById[productId] || 0) + 1;
};

export const startCheckout = ({ getters }) => {
  return getters.getInitialState();
};

export const finishCheckout = () => { /* */ };

export const restore = (_, cart) => {
  return cart;
};
