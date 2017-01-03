// @flow

import { createConnector } from 'slux/react';
import rootStore from './stores/root';
import productsStore from './stores/products';
import type { RootStoreRef } from './stores/root';
import type { ProductsStoreRef } from './stores/products';

export interface Stores {
  root: RootStoreRef;
  products: ProductsStoreRef;
}

export default createConnector((getRef): Stores => ({
  root: getRef(rootStore),
  products: getRef(productsStore),
}));

