// @flow

import { TypedStore } from 'slux';

// XXX: 型情報がとれない..?????
// import * as getters from './getters';

// default export ならOK
import getters from './getters';

import * as mutations from './mutations';
import * as actions from './actions';

import type { GetterCreator, GetterCreators } from 'slux'
import type { Getters } from './getters'

export type Product = {
  id: number,
  title: string,
  price: number,
  inventory: number
}

export type State = {
  addedIds: number[],
  quantityById: {
    [key: number]: number
  }
}

const getInitialState = (): State => ({
  addedIds: [],
  quantityById: {},
});

// これはちゃんとエラーになる
// console.log(getters.hasProduct(0))
// console.log(getters.abcde)

// これはOK
const g: GetterCreator<State, Getters, number => boolean> = getters.hasProduct

// これもOK
const gss: GetterCreators<State, Getters> = {
  getQuantity: getters.getQuantity,
  getAddedIds: getters.getAddedIds,
  hasProduct: getters.hasProduct,
}


// なのにこれはダメ。。
// TypeScriptだと問題ない。typeに足りない定義があってもコンパイル通るけど。
// const gs: GetterCreators<State, Getters> = getters

export type CartStore = TypedStore<State, Getters, any, any>

// const cartStore: CartStore = new TypedStore({
//   name: 'CartStore',
//   getters,
//   mutations,
//   actions,
//   getInitialState,
// });

// export default CartStore
