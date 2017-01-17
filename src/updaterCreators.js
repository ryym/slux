export const methodTypes = {
  MUTATION: 'mutation',
  EFFECT: 'effect',
};

const createMutationCreator = (selectState, mergeState) => {
  return dependency => (type, getMutation) => {
    const exec = (wholeState, payload) => {
      const state = selectState(wholeState);
      const newState = getMutation(dependency)(state, payload);
      return mergeState(wholeState, newState);
    };
    return {
      methodType: methodTypes.MUTATION,
      type,
      exec,

      // XXX: Have these methods to hold a state type.
      selectState,
      mergeState,
    };
  };
};

const createNoDepMutationCreator = (selectState, mergeState) => {
  const injectDep = createMutationCreator(selectState, mergeState);
  const create = injectDep();
  return (type, mutation) => create(type, () => mutation);
};

export const createMutation = createNoDepMutationCreator;

export const createMutationWithDep = createMutationCreator;

export const mutation = createNoDepMutationCreator(
  state => state,
  (_, state) => state
);

export const mutationWith = createMutationCreator(
  state => state,
  (_, state) => state
);

// TODO: enable to select and merge a state model.
const createEffectCreator = () => {
  return dependency => (type, getEffect) => {
    return {
      methodType: methodTypes.EFFECT,
      type,
      with: getEffect,
      exec: getEffect(dependency),
    };
  };
};

const createNoDepEffectCreator = (selectState, mergeState) => {
  const injectDep = createEffectCreator(selectState, mergeState);
  const create = injectDep();
  return (type, effect) => create(type, () => effect);
};

export const createEffect = createNoDepEffectCreator;

export const createEffectWithDep = createEffectCreator;

export const effect = createNoDepEffectCreator();

export const effectWith = createEffectCreator();

