export const initialize = ({ state }) => (products) => {
  state.byId = products.reduce((map, product) => {
    map[product.id] = product;
    return map;
  }, {});
  state.visibleIds = products.map(p => p.id);
};

export const pickup = ({ state }) => (productId) => {
  state.byId[productId].inventory -= 1;
};

