// @flow

import { combineStores } from 'slux';
import cartStore from '../cart';
import productsStore from '../products';

import type {
  CombinedGetter,
  CombinedMutation,
  CombinedAction,
  CombinedSealedStore,
} from 'slux';
import type { SealedCartStore } from '../cart';
import type { SealedProductsStore } from '../products';

export type RootState = void;

export type RootSubStores = {
  cart: SealedCartStore,
  products: SealedProductsStore
};

export type RootGetter<P, R> = CombinedGetter<RootState, RootSubStores, P, R>;
export type RootMutation<P> = CombinedMutation<RootState, RootSubStores, P>;
export type RootAction<P, R> = CombinedAction<RootState, RootSubStores, P, R>;
export type SealedRootStore = CombinedSealedStore<RootState, RootSubStores, any>;

const takeSnapshot = (_: RootState, { cart, products }: RootSubStores) => ({
  cart: cart.takeSnapshot(),
  products: products.takeSnapshot(),
});

export default combineStores({
  name: 'RootStore',
  stores: (seal): RootSubStores => ({
    cart: seal(cartStore),
    products: seal(productsStore),
  }),
  getInitialState: (): void => {},
  takeSnapshot,
});
