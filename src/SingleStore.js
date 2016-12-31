import Store from './Store';
import SealedStore from './SealedStore';

const createAccessorContexts = store => {
  const { query, commit, run } = store;

  const stores = {};
  Object.defineProperty(stores, '_self', {
    value: new SealedStore(store),
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
