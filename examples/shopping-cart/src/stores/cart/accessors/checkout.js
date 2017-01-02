import { mutation, actionWith } from 'slux';
import { getState, getInitialState } from 'slux/getters';
import shop from '../../../api/shop';

export const startCheckout = mutation(
  'Start Checkout',
  (_, { query }) => query(getInitialState)
);

export const finishCheckout = mutation(
  'Finish Checkout',
  state => state
);

export const restore = mutation(
  'Restore Cart',
  (state, _, cart) => cart
);

export const checkout = actionWith(
  shop,
  'Checkout',
  shop => ({ query, commit }, products) => {
    const cart = query(getState);
    commit(startCheckout);
    return shop.buyProducts(products).then(err => {
      err ? commit(restore, cart) : commit(finishCheckout);
    });
  }
);
