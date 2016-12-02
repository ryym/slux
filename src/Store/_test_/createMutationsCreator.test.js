import test from 'ava';
import sinon from 'sinon';
import createMutationsCreator from '../createMutationsCreator';

test('create mutations that mutate state', t => {
  const state = { a: 1 };
  const mutations = {
    addValue({ state }, value) {
      state.a += value;
    },
  };
  const wrappedMutations = createMutationsCreator(mutations)({
    getState: () => state,
  });

  wrappedMutations.addValue(4);
  t.deepEqual(state, { a: 5 });
});

test('create mutations with specified names', t => {
  const mutations = {
    mutateA() {},
    mutateB() {},
  };
  const wrappedMutations = createMutationsCreator(mutations)({ getState() {} });
  const mutationNames = Object
    .keys(wrappedMutations)
    .map(k => wrappedMutations[k].name);
  t.deepEqual(mutationNames, ['mutateA', 'mutateB']);
});

test('execute callback before and after mutation', t => {
  const mutations = {
    mutateA({ state }, a, b, c) {
      state.a = a * b * c;
    },
  };
  const onMutationStart = sinon.spy();
  const onMutationEnd = sinon.spy();
  const wrappedMutations = createMutationsCreator(mutations)({
    getState: () => ({ a: 1 }),
    onMutationStart,
    onMutationEnd,
  });

  const mutationArgs = [2, 4, 6];
  const nextState = { a: 48 };

  wrappedMutations.mutateA(...mutationArgs);
  t.deepEqual(onMutationStart.args, [['mutateA', mutationArgs]]);
  t.deepEqual(onMutationEnd.args, [['mutateA', nextState]]);
});
