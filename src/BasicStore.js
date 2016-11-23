import Store from './Store'
import createActions from './createActions'
import createMutations from './createMutations'
import createGetters from './createGetters'

export default class BasicStore extends Store {
  constructor({
    name,
    getters = {},
    mutations = {},
    actions = {},
    subStores = {},
    getInitialState,
  }) {
    super({
      name,
      getters: createGetters(getters),
      mutations: createMutations(mutations),
      actions: createActions(actions),
      subStores,
      getInitialState
    })
  }
}
