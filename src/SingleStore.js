import Store from './Store';

const createAccessorContexts = (store) => {
  const { query, commit, run } = store;
  const stores = {};
  return {
    getter: { query, stores },
    mutation: { query, commit, stores },
    action: { query, commit, run, stores },
  };
};

export default class SingleStore extends Store {
  constructor({
    getInitialState,
    takeSnapshot,
  }) {
    super({
      getInitialState,
      takeSnapshot,
      createAccessorContexts,
    });
  }
}
