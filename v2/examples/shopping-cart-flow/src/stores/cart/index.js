// @flow

import { createStore } from 'slux';
import type {
  SingleGetter, SingleMutation, SingleAction,
  SingleStoreRef,
} from 'slux';

export type CartState = {
  addedIds: number[],
  quantityById: { [key: number]: number }
}

export type CartGetter<P, R> = SingleGetter<CartState, P, R>
export type CartMutation<P> = SingleMutation<CartState, P>
export type CartAction<P, R> = SingleAction<CartState, P, R>
export type CartStoreRef = SingleStoreRef<CartState, CartState>;

const getInitialState = (): CartState => ({
  addedIds: [],
  quantityById: {},
});

const takeSnapshot = (state: CartState): CartState => ({
  addedIds: state.addedIds.slice(0),
  quantityById: { ...state.quantityById },
});

export default createStore({
  name: 'CartStore',
  getInitialState,
  takeSnapshot,
});
