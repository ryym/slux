import mapObject from './mapObject'
import EventEmitter from 'events'

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
    this._emitter = new EventEmitter()

    this.dispatch = this.dispatch.bind(this)
  }

  getCommands() {
    return this._commandKeys
  }

  dispatch(command, ...args) {
    const handler = this._commandHandlers[command]
    if (handler) {
      this._emitter.emit('DISPATCH', command, args)
      handler(...args)
    }
    else {
      throw new Error(`The '${command}' command is not defined`)
    }
  }

  onDispatch(handler) {
    this._emitter.on('DISPATCH', handler)
  }

  onStateChange(handler) {
    this._store.subscribe(handler)
  }

  getStore() {
    return this._store
  }
}

export default function createDispatcher(store, defineCommands) {
  return new Dispatcher(store, defineCommands)
}
