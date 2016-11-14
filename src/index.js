import createGetters from './createGetters'
import createMutations from './createMutations'
import createActions from './createActions'
import createDispatcher from './createDispatcher'
import Store from './Store'

// XXX
import connect from './react/connect'
import Provider from './react/Provider'

module.exports = {
  createGetters,
  createMutations,
  createActions,
  Store,
  connect,
  Provider,
  createDispatcher
}
