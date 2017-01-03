// @flow

import { createStore } from 'slux';

import type {
  SingleGetter, SingleMutation, SingleAction,
  SingleSealedStore,
} from 'slux';
import type { Product } from '../../types';

export type ProductsState = {
  byId: { [key: number]: Product },
  visibleIds: number[]
};

export type ProductsGetter<P, R> = SingleGetter<ProductsState, P, R>;
export type ProductsMutation<P> = SingleMutation<ProductsState, P>;
export type ProductsAction<P, R> = SingleAction<ProductsState, P, R>;
export type SealedProductsStore = SingleSealedStore<ProductsState, ProductsState>;

const getInitialState = (): ProductsState => ({
  byId: {},
  visibleIds: [],
});

const takeSnapshot = (state: ProductsState): ProductsState => ({
  byId: { ...state.byId },
  visibleIds: state.visibleIds.slice(0),
});

export default createStore({
  name: 'ProductsStore',
  getInitialState,
  takeSnapshot,
});
