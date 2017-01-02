import { createConnector } from 'slux/react';
import rootStore, { SealedRootStore } from './stores/root';
import productsStore, { SealedProductsStore } from './stores/products';

export interface Stores {
    root: SealedRootStore;
    products: SealedProductsStore;
}

export default createConnector((seal): Stores => ({
    root: seal(rootStore),
    products: seal(productsStore)
}));

