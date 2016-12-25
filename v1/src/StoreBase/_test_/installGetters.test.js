import test from 'ava';
import StoreBase from '../../StoreBase';

test('set returned value as getters', t => {
  const getters = {};
  const store = new StoreBase({
    name: 'test-store',
    createGetters: () => getters,
  });
  store.installGetters();
  t.is(store.getters, getters);
});

test('pass available getters to createGetters', t => {
  t.plan(3);
  const createGetters = ({ getState, subGetters, defaultGetters }) => {
    t.deepEqual(getState(), { a: 1 });
    t.deepEqual(Object.keys(subGetters), ['foo']);
    t.deepEqual(Object.keys(defaultGetters), ['getInitialState', 'getOwnState', 'takeSnapshot']);
  };

  const store = new StoreBase({
    name: 'test-store',
    createGetters,
    subStores: {
      foo: { getters: {} },
    },
    getInitialState: () => ({ a: 1 }),
  });

  store.initializeState();
  store.installGetters();
});
