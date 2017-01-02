import { createConnector } from 'slux/react';
import rootStore from './stores/root';
import productsStore from './stores/products';

export default createConnector(seal => ({
  root: seal(rootStore),
  products: seal(productsStore),
}));
