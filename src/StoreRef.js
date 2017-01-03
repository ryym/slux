export const _STORE_REF_ACCESS_KEY = '-STORE_REF_ACCESS_KEY-';

export default class StoreRef {
  constructor(store) {
    this._store = store;
  }

  getStore(accessKey) {
    if (accessKey === _STORE_REF_ACCESS_KEY) {
      return this._store;
    }
    throw new Error('getStore can be used only inside of Slux');
  }

  takeSnapshot() {
    return this._store.takeSnapshot();
  }
}
