/**
 * Dispatcher updates a store state from a command.
 */
export default class Dispatcher {
  constructor(store, handlers) {
    this._store = store;
    this._handlers = handlers;

    this.dispatch = this.dispatch.bind(this);
  }

  dispatch({ type, payload }) {
    const handler = this._handlers[type];
    if (typeof handler !== 'function') {
      throw new Error(`Slux: Can not find a handler for dispatched command '${type}'`);
    }
    handler(payload);
  }

  getStore() {
    return this._store;
  }
}
