import Store from './Store';

const createAccessorContexts = (store, stores) => {
  const { query, commit, run } = store;
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
