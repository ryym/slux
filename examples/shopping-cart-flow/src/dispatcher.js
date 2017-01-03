// @flow

import { createCombinedDispatcher } from 'slux';
import root from './stores/root';
import { addToCart } from './stores/root/accessors';
import cart from './stores/cart';
import { checkout } from './stores/cart/accessors';
import products from './stores/products';
import { loadProducts } from './stores/products/accessors';

export const { dispatcher, commands } = createCombinedDispatcher(
  root,
  (commit, run) => ({
    loadProducts: run(products, loadProducts),
    addToCart: commit(root, addToCart),
    checkout: run(cart, checkout),
  })
);
