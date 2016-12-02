import test from 'ava';
import StoreBase from '../../StoreBase';

test('set returned value as actions', t => {
  const actions = {};
  const store = new StoreBase({
    name: 'test-store',
    createActions: () => actions,
  });
  store.installActions();
  t.is(store.actions, actions);
});

test('pass actions, mutations, getters and handlers to createActions', t => {
  const getters = { get1() {} };
  const mutations = { mutate1() {} };

  t.plan(4);
  const createActions = (arg) => {
    t.deepEqual(Object.keys(arg.subActions), ['foo']);
    t.is(arg.getters, getters);
    t.is(arg.mutations, mutations);
    t.true(typeof arg.onAction === 'function');
  };

  const store = new StoreBase({
    name: 'test-store',
    createActions,
    subStores: {
      foo: { actions: {} },
    },
  });

  store.initializeState();
  store.installActions(getters, mutations);
});
