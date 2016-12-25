export const getQuantity = ({ state }, productId) =>
  state.quantityById[productId] || 0;

export const getAddedIds = ({ state }) =>
  state.addedIds;

export const hasProduct = ({ state }, id) =>
  state.addedIds.indexOf(id) >= 0;
