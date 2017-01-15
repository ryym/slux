export const methodTypes = {
  MUTATION: 'mutation',
  ACTION: 'action',
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
const createActionCreator = () => {
  return dependency => (type, getAction) => {
    return {
      methodType: methodTypes.ACTION,
      type,
      with: getAction,
      exec: getAction(dependency),
    };
  };
};

const createNoDepActionCreator = (selectState, mergeState) => {
  const injectDep = createActionCreator(selectState, mergeState);
  const create = injectDep();
  return (type, action) => create(type, () => action);
};

export const createAction = createNoDepActionCreator;

export const createActionWithDep = createActionCreator;

export const action = createNoDepActionCreator();

export const actionWith = createActionCreator();

