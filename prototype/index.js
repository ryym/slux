import createGetters from './createGetters'
import createMutations from './createMutations'
import createActions from './createActions'
import createDispatcher from './createDispatcher'
import Store from './Store'
import BasicStore from './BasicStore'

// XXX
import connect from './react/connect'
import Provider from './react/Provider'

// XXX
import waitAction, { wait } from './testutils/waitAction'

module.exports = {
  createGetters,
  createMutations,
  createActions,
  Store,
  BasicStore,
  connect,
  Provider,
  createDispatcher,
  waitAction,
  wait
}
