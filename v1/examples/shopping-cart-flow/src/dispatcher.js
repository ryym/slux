import { createDispatcher } from 'slux';
import store from './stores/root';

export const { dispatcher, commands } = createDispatcher(store, (m, a, to) => ({
  loadProducts: to(a.products.loadProducts, 'LOAD_PRODUCTS'),
  addToCart: to(m.addToCart, 'ADD_TO_CART'),
  checkout: to(a.cart.checkout, 'REQUEST_CHECKOUT'),
}));
