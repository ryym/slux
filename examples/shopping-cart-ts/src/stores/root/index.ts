import {
    combineStores,
    CombinedGetterContext,
    CombinedMutationContext,
    CombinedActionContext,
    CombinedStoreRef
} from 'slux';
import cartStore, { CartStoreRef } from '../cart';
import productsStore, { ProductsStoreRef } from '../products';

export type RootState = void;

export type RootSubStores = {
    cart: CartStoreRef,
    products: ProductsStoreRef
};

export type RootGcx = CombinedGetterContext<RootState, RootSubStores>;
export type RootMcx = CombinedMutationContext<RootState, RootSubStores>;
export type RootAcx = CombinedActionContext<RootState, RootSubStores>;
export type RootStoreRef = CombinedStoreRef<RootState, RootSubStores, any>;

const takeSnapshot = (_: RootState, { cart, products }: RootSubStores) => ({
    cart: cart.takeSnapshot(),
    products: products.takeSnapshot(),
});

export default combineStores({
    name: 'RootStore',
    stores: (getRef): RootSubStores => ({
        cart: getRef(cartStore),
        products: getRef(productsStore)
    }),
    getInitialState: (): void => {},
    takeSnapshot,
});
