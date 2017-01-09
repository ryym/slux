export default class StoreFacade {
  constructor(store, methods) {
    this._store = store;
    this.methods = methods;
  }

  onStateChange(handler) {
    return this._store.onStateChange(handler);
  }

  takeSnapshot() {
    return this._store.takeSnapshot();
  }
}
