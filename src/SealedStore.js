export const _SEALED_STORE_ACCESS_KEY = '-SEALED_STORE_ACCESS_KEY-';

export default class SealedStore {
  constructor(store) {
    this._store = store;
  }

  getStore(accessKey) {
    if (accessKey === _SEALED_STORE_ACCESS_KEY) {
      return this._store;
    }
    throw new Error('getStore can be used only inside of Slux');
  }

  takeSnapshot() {
    return this._store.takeSnapshot();
  }
}
