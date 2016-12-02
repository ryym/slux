import { mapObject } from '../utils/object';
import { bindMethodContext } from '../utils/class';

function createCommands(store, define) {
  const handlers = define(store.mutations, store.actions);
  return {
    keys: mapObject(handlers, (v, k) => k),
    handlers,
  };
}

export default class Dispatcher {
  constructor(store, defineCommands) {
    const { keys, handlers } = createCommands(store, defineCommands);
    this._commandKeys = Object.freeze(keys);
    this._commandHandlers = Object.freeze(handlers);
    this._store = store;

    bindMethodContext(this, ['dispatch']);
  }

  getCommands() {
    return this._commandKeys;
  }

  dispatch(command, ...args) {
    const handler = this._commandHandlers[command];
    if (handler) {
      handler(...args);
    }
    else {
      throw new Error(`The '${command}' command is not defined`);
    }
  }

  getStore() {
    return this._store;
  }
}

