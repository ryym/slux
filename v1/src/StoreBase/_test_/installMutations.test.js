import test from 'ava';
import StoreBase from '../../StoreBase';

test('set returned value as mutations', t => {
  const mutations = {};
  const store = new StoreBase({
    name: 'test-store',
    createMutations: () => mutations,
  });
  store.installMutations();
  t.is(store.mutations, mutations);
});

test('pass mutations, getters and handlers to createMutations', t => {
  const getters = { get1() {} };

  t.plan(4);
  const createMutations = (arg) => {
    t.deepEqual(arg.getState(), { a: 1 });
    t.deepEqual(Object.keys(arg.subMutations), ['foo']);
    t.is(arg.getters, getters);

    const isFunc = f => typeof f === 'function';
    t.true([arg.onMutationStart, arg.onMutationEnd].every(isFunc));
  };

  const store = new StoreBase({
    name: 'test-store',
    createMutations,
    subStores: {
      foo: { mutations: {} },
    },
    getInitialState: () => ({ a: 1 }),
  });

  store.initializeState();
  store.installMutations(getters);
});

test('commit mutation via passed callbacks', t => {
  const createMutations = ({ onMutationStart, onMutationEnd }) => {
    onMutationStart('mutateFoo');
    onMutationEnd('mutateFoo', { a: 2 });
  };

  const store = new StoreBase({
    name: 'test-store',
    createMutations,
  });

  store.installMutations({});
  t.deepEqual(store.getOwnState(), { a: 2 });
});
