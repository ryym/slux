// @flow

import { getter, mutation } from 'slux';
import type { CartState, CartGetter, CartMutation } from '../';

export const getQuantity: CartGetter<number, number> = getter(
  (state, _, productId) => state.quantityById[productId] || 0
);

export const getAddedIds: CartGetter<void, number[]> = getter(
  (state: CartState) => state.addedIds
);

export const hasProduct: CartGetter<number, boolean> = getter(
  (state, _, productId) => state.addedIds.indexOf(productId) >= 0
);

export const addProduct: CartMutation<number> = mutation(
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
