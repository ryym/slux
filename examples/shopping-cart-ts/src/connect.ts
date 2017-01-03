import { createConnector } from 'slux/react';
import rootStore, { RootStoreRef } from './stores/root';
import productsStore, { ProductsStoreRef } from './stores/products';

export interface Stores {
    root: RootStoreRef;
    products: ProductsStoreRef;
}

export default createConnector((getRef): Stores => ({
    root: getRef(rootStore),
    products: getRef(productsStore)
}));

