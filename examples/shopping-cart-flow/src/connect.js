// @flow

import { createConnector } from 'slux/react';
import rootStore from './stores/root';
import productsStore from './stores/products';
import type { SealedRootStore } from './stores/root';
import type { SealedProductsStore } from './stores/products';

export interface Stores {
  root: SealedRootStore;
  products: SealedProductsStore;
}

export default createConnector((seal): Stores => ({
  root: seal(rootStore),
  products: seal(productsStore),
}));

