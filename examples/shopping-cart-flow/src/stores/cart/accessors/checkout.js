// @flow

import { mutation, actionWith } from 'slux';
import { getState, getInitialState } from 'slux/getters';
import type { CartState, CartMutation, CartAction } from '../';
import shop, { ShopAPI } from '../../../api/shop';
import { Product } from '../../../types';

export const startCheckout: CartMutation<void> = mutation(
    'Start Checkout',
    (_, { query }) => query(getInitialState)
);

export const finishCheckout: CartMutation<void> = mutation(
    'Finish Checkout',
    state => state
);

export const restore: CartMutation<CartState> = mutation(
    'Restore Cart',
    (state, _, cart) => cart
);

export const checkout: CartAction<Product[], void> = actionWith(
    shop,
    'Checkout',
    (shop: ShopAPI) => ({ query, commit }, products) => {
      const cart = query(getState);
      commit(startCheckout);
      shop.buyProducts(products, err => {
        err ? commit(restore, cart) : commit(finishCheckout);
      });
    }
);
