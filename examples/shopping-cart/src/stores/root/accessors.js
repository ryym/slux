import { getter, mutation } from 'slux';
import {
  getQuantity,
  getAddedIds,
  addProduct,
} from '../cart/accessors';
import {
  getProduct,
  hasStock,
  pickup,
} from '../products/accessors';


export const getTotal = getter(
  (_, { query, stores: { self } }) => {
    return query(self, getCartProducts).reduce((total, p) =>
      total + p.price + p.quantity,
      0
    );
  }
);

export const getCartProducts = getter(
  (_, { query, stores: { cart, products } }) => {
    return query(cart, getAddedIds).map(id => ({
      ...query(products, getProduct, id),
      quantity: query(cart, getQuantity, id),
    }));
  }
);

export const addToCart = mutation(
  'Add Product to Cart',
  (_, { query, commit, stores }, productId) => {
    const { cart, products } = stores;
    if (query(products, hasStock, productId)) {
      commit(products, pickup, productId);
      commit(cart, addProduct, productId);
    }
  }
);
