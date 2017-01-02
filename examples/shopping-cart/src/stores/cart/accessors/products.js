import { getter, mutation } from 'slux';

export const getQuantity = getter(
  (state, _, productId) => state.quantityById[productId] || 0
);

export const getAddedIds = getter(
  state => state.addedIds
);

export const hasProduct = getter(
  (state, _, productId) => state.addedIds.indexOf(productId) >= 0
);

export const addProduct = mutation(
  'Add Product',
  (state, { query }, productId) => {
    const { addedIds, quantityById } = state;
    if (! query(hasProduct, productId)) {
      addedIds.push(productId);
    }
    quantityById[productId] = query(getQuantity, productId) + 1;

    return state;
  }
);
