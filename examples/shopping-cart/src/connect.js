import { createConnector } from 'slux/react';
import rootStore from './stores/root';
import productsStore from './stores/products';

export default createConnector(getRef => ({
  root: getRef(rootStore),
  products: getRef(productsStore),
}));
