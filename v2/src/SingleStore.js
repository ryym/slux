import Store from './Store';
import StoreRef from './StoreRef';

const createAccessorContexts = store => {
  const { query, commit, run } = store;

  const stores = {};
  Object.defineProperty(stores, '_self', {
    value: new StoreRef(store),
  });

  return {
    getter: { query, stores },
    mutation: { query, commit, stores },
    action: { query, commit, run, stores },
  };
};

export default class SingleStore extends Store {
  constructor({
    name,
    getInitialState,
    takeSnapshot,
  }) {
    super({
      name,
      getInitialState,
      takeSnapshot,
      createAccessorContexts,
      defineSubStores: () => ({}),
    });
  }
}
