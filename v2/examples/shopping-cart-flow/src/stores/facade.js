// @flow

import { createCombinedFacade } from 'slux';
import root from './root';
import {
  getCartProducts,
  getTotal,
  addToCart,
} from './root/accessors';
import {
  checkout,
} from './cart/accessors';
import {
  getVisibleProducts,
  loadProducts,
} from './products/accessors';

export default createCombinedFacade(root, ({
  query, commit, run,
  stores: { self, cart, products },
}) => ({
  getCartProducts: query(self, getCartProducts),
  getTotal: query(self, getTotal),
  addToCart: commit(self, addToCart),

  checkout: run(cart, checkout),

  getVisibleProducts: query(products, getVisibleProducts),
  loadProducts: run(products, loadProducts),
}));
