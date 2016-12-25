import { mapObject } from '../utils/object';

export default function createMutationsCreator(mutations) {
  return function createMutations({
    getState,
    getters = {},
    subMutations = {},
    onMutationStart = () => {},
    onMutationEnd = () => {},
  }) {
    let _mutations;  // eslint-disable-line prefer-const

    const ownMutations = mapObject(mutations, (mutation, name) => {
      const wrappedMutation = (payload) => {
        const state = getState();
        const context = { state, getters, mutations: _mutations };
        const actualMutation = mutation(context)

        onMutationStart(name, payload);
        const returnValue = actualMutation(payload);
        const nextState = returnValue !== undefined ? returnValue : state;
        onMutationEnd(name, nextState);
      };

      Object.defineProperty(wrappedMutation, 'name', { value: name });
      return wrappedMutation;
    });

    _mutations = {
      ...ownMutations,
      ...subMutations,
    };

    return _mutations;
  };
}

