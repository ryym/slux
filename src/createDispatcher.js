import mapObject from './mapObject'

function createCommands(store, define) {
  const handlers = define(store.mutations, store.actions)
  return {
    keys: mapObject(handlers, (v, k) => k),
    handlers
  }
}

// Store facade for views.
export class Dispatcher {
  constructor(store, defineCommands) {
    const { keys, handlers } = createCommands(store, defineCommands)
    this._commandKeys = keys
    this._commandHandlers = handlers
    this._store = store

    this.dispatch = this.dispatch.bind(this)
  }

  getCommands() {
    return this._commandKeys
  }

  dispatch(command, ...args) {
    const handler = this._commandHandlers[command]
    if (handler) {
      handler(...args)
    }
  }

  getStore() {
    return this._store
  }
}

export default function createDispatcher(store, defineCommands) {
  return new Dispatcher(store, defineCommands)
}
