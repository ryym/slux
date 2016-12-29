import Store from './Store';
import SealedStore, {
  _SEALED_STORE_ACCESS_KEY,
} from './SealedStore';

export const query = (sealedStore, getter, payload) => {
  return sealedStore
    .getStore(_SEALED_STORE_ACCESS_KEY)
    .query(getter, payload);
};

export const commit = (sealedStore, mutation, payload) => {
  return sealedStore
    .getStore(_SEALED_STORE_ACCESS_KEY)
    .commit(mutation, payload);
};

export const run = (sealedStore, action, payload) => {
  return sealedStore
    .getStore(_SEALED_STORE_ACCESS_KEY)
    .run(action, payload);
};

const seal = store => new SealedStore(store);

const createAccessorContexts = (sealedStores) => (store) => {
  const stores = Object.assign({}, sealedStores, {
    self: seal(store),
  });
  return {
    getter: { query, stores },
    mutation: { query, commit, stores },
    action: { query, commit, run, stores },
  };
};

export default class CombinedStore extends Store {
  constructor({
    getInitialState,
    takeSnapshot,
    stores,
  }) {
    const sealedStores = stores(seal);
    super({
      getInitialState,
      takeSnapshot,
      createAccessorContexts: createAccessorContexts(sealedStores),
    });

    this._sealedStores = sealedStores;
  }

  withSubs(process) {
    const accessors = { query, commit, run };
    process(this._sealedStores, accessors);
  }
}

