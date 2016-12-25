export const hasStock = ({ getters }) => id => {
  const product = getters.getProduct(id);
  return product && product.inventory > 0;
};

export const getProduct = ({ state }) => id =>
  state.byId[id];

export const getVisibleProducts = ({ state, getters }) => () =>
  state.visibleIds.map(getters.getProduct);

