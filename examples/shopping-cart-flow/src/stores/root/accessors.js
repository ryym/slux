// @flow

import { getter, mutation } from 'slux';
import { getQuantity, getAddedIds, addProduct } from '../cart/accessors';
import { getProduct, hasStock, pickup } from '../products/accessors';
import type { RootGetter, RootMutation } from './';
import type { CartProduct } from '../../types';


export const getTotal: RootGetter<void, number> = getter(
  (_, { query, stores: { self } }) => {
    return query(self, getCartProducts).reduce((total, p) => {
      return total + p.price + p.quantity;
    }, 0);
  }
);

export const getCartProducts: RootGetter<void, CartProduct[]> = getter(
  (_, { query, stores: { cart, products } }) => {
    return query(cart, getAddedIds).map(id => ({
      ...query(products, getProduct, id),
      quantity: query(cart, getQuantity, id),
    }));
  }
);

export const addToCart: RootMutation<number> = mutation(
  'Add Product to Cart',
  (_, context, productId) => {
    const { query, commit, stores: { cart, products } } = context;
    if (query(products, hasStock, productId)) {
      commit(products, pickup, productId);
      commit(cart, addProduct, productId);
    }
  }
);
