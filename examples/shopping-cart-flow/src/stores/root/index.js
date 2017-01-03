// @flow

import { combineStores } from 'slux';
import cartStore from '../cart';
import productsStore from '../products';

import type {
  CombinedGetter,
  CombinedMutation,
  CombinedAction,
  CombinedStoreRef,
} from 'slux';
import type { CartStoreRef } from '../cart';
import type { ProductsStoreRef } from '../products';

export type RootState = void;

export type RootSubStores = {
  cart: CartStoreRef,
  products: ProductsStoreRef
};

export type RootGetter<P, R> = CombinedGetter<RootState, RootSubStores, P, R>;
export type RootMutation<P> = CombinedMutation<RootState, RootSubStores, P>;
export type RootAction<P, R> = CombinedAction<RootState, RootSubStores, P, R>;
export type RootStoreRef = CombinedStoreRef<RootState, RootSubStores, any>;

const takeSnapshot = (_: RootState, { cart, products }: RootSubStores) => ({
  cart: cart.takeSnapshot(),
  products: products.takeSnapshot(),
});

export default combineStores({
  name: 'RootStore',
  stores: (getRef): RootSubStores => ({
    cart: getRef(cartStore),
    products: getRef(productsStore),
  }),
  getInitialState: (): void => {},
  takeSnapshot,
});
