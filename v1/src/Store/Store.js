import createGettersCreator from './createGettersCreator';
import createMutationsCreator from './createMutationsCreator';
import createActionsCreator from './createActionsCreator';
import StoreBase from '../StoreBase';

export default class Store extends StoreBase {
  constructor({
    getters = {},
    mutations = {},
    actions = {},
    ...restConfigs
  }) {
    super({
      createGetters: createGettersCreator(getters),
      createMutations: createMutationsCreator(mutations),
      createActions: createActionsCreator(actions),
      ...restConfigs,
    });

    this.constructStore();
  }
}
