// Slux Version 2 Prototype

import * as slux from '../src'

export const createStore = slux.createStore
export const combineStores = slux.combineStores
export const createDispatcher = slux.createDispatcher
export const getter = slux.getter
export const getterWith = slux.getterWith
export const mutation = slux.mutation
export const mutationWith = slux.mutationWith
export const action = slux.action
export const actionWith = slux.actionWith

export function createConnector(defineStores) {
  const seal = store => store
  const sealedStores = defineStores(seal)

  return function connect(mapStateToProps /*, mapDispatchToProps */) {
    return function wrapWithConnect(Component) {
      class Connect { //extends Component 
        constructor(props, context) {
          const store = getStore(context)
          const mappedProps = mapStateToProps(store.query, sealedStores, props)
          // ...
        }
      }
    }
  }
}
