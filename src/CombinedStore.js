import Store from './Store';
import StoreRef, {
  _STORE_REF_ACCESS_KEY,
} from './StoreRef';

export const query = (storeRef, getter, payload) => {
  return storeRef
    .getStore(_STORE_REF_ACCESS_KEY)
    .query(getter, payload);
};

export const commit = (storeRef, mutation, payload) => {
  return storeRef
    .getStore(_STORE_REF_ACCESS_KEY)
    .commit(mutation, payload);
};

export const run = (storeRef, action, payload) => {
  return storeRef
    .getStore(_STORE_REF_ACCESS_KEY)
    .run(action, payload);
};

const createAccessorContexts = (store, storeRefs) => {
  const stores = Object.assign({}, storeRefs, {
    self: new StoreRef(store),
  });
  return {
    getter: { query, stores },
    mutation: { query, commit, stores },
    action: { query, commit, run, stores },
  };
};

export default class CombinedStore extends Store {
  constructor({
    name,
    getInitialState,
    takeSnapshot,
    stores,
  }) {
    super({
      name,
      getInitialState,
      takeSnapshot,
      createAccessorContexts,
      defineSubStores: stores,
    });
    this._subscribeSubStoreChanges();
    this._storeRefWithSelf = Object.assign({}, this._storeRefs, {
      self: new StoreRef(this),
    });
  }

  takeSnapshot() {
    return this._takeSnapshot(this.getState(), this._storeRefs);
  }

  withSubs(process) {
    const accessors = { query, commit, run };
    process(this._storeRefs, accessors);
  }

  _getStoreRefs() {
    return this._storeRefWithSelf;
  }

  _subscribeSubStoreChanges() {
    Object.keys(this._storeRefs).forEach(name => {
      const store = this._storeRefs[name].getStore(_STORE_REF_ACCESS_KEY);
      store.onMutation(this._handleSubStoreMutation);
      store.onAction(this._notifyActionRun);
      store.onError(this._handleSubStoreError);
    });
  }
}

