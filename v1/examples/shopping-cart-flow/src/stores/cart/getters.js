// @flow

import type { GetterCreator } from 'slux'
import type { State } from './'

export type Getters = {
  getQuantity: GetQuantity,
  getAddedIds: GetAddedIds,
  hasProduct: HasProduct
}
type Getter<F> = GetterCreator<State, Getters, F>


type GetQuantity = (productId: number) => number

export const getQuantity: Getter<GetQuantity> =
  ({ state }) => productId => state.quantityById[productId] || 0;


type GetAddedIds = () => number[]

export const getAddedIds: Getter<GetAddedIds> =
  ({ state }) => () => state.addedIds;


type HasProduct = (id: number) => boolean

export const hasProduct: Getter<HasProduct> =
  ({ state }) => id => state.addedIds.indexOf(id) >= 0;


export default {
  getQuantity,
  getAddedIds,
  hasProduct,
}

// import type { GetterCreators } from 'slux'

// const g: GetterCreators<State, Getters> = {
//   getQuantity,
//   getAddedIds,
//   hasProduct,
// }
