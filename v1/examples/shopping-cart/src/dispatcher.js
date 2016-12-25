import { createDispatcher } from 'slux';
import store from './stores/root';

const defineCommands = (mutations, actions, to) => ({
  loadProducts: to(actions.products.loadProducts, 'LOAD_PRODUCTS'),
  addToCart: to(mutations.addToCart, 'ADD_TO_CART'),
  checkout: to(actions.cart.checkout, 'REQUEST_CHECKOUT'),
});

export const { dispatcher, commands } = createDispatcher(store, defineCommands);
