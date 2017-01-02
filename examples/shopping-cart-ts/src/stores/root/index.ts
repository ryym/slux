import {
    combineStores,
    CombinedGetterContext,
    CombinedMutationContext,
    CombinedActionContext,
    CombinedSealedStore
} from 'slux';
import cartStore, { SealedCartStore } from '../cart';
import productsStore, { SealedProductsStore } from '../products';

export type RootState = void;

export type RootSubStores = {
    cart: SealedCartStore,
    products: SealedProductsStore
};

export type RootGcx = CombinedGetterContext<RootState, RootSubStores>;
export type RootMcx = CombinedMutationContext<RootState, RootSubStores>;
export type RootAcx = CombinedActionContext<RootState, RootSubStores>;
export type SealedRootStore = CombinedSealedStore<RootState, RootSubStores, any>;

const takeSnapshot = (_: RootState, { cart, products }: RootSubStores) => ({
    cart: cart.takeSnapshot(),
    products: products.takeSnapshot(),
});

export default combineStores({
    name: 'RootStore',
    stores: (seal): RootSubStores => ({
        cart: seal(cartStore),
        products: seal(productsStore)
    }),
    getInitialState: (): void => {},
    takeSnapshot,
});
