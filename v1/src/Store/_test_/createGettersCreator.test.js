import test from 'ava';
import createGettersCreator from '../createGettersCreator';

test('create getters that return value from state', t => {
  const getters = {
    getValue: ({ state }, num) => state + num,
  };
  const wrappedGetters = createGettersCreator(getters)({
    getState: () => 100,
  });
  t.is(wrappedGetters.getValue(100), 200);
});

test('create getters with specified names', t => {
  const getters = {
    getA() {},
    getB() {},
  };
  const wrappedGetters = createGettersCreator(getters)({ getState() {} });

  const getterNames = Object.keys(wrappedGetters).map(k => wrappedGetters[k].name);
  t.deepEqual(getterNames, ['getA', 'getB']);
});

test('accept default getters', t => {
  const defaultGetters = {
    getA() {},
    getB() {},
  };
  const wrappedGetters = createGettersCreator({})({
    getState() {},
    defaultGetters,
  });

  t.deepEqual(Object.keys(wrappedGetters), ['getA', 'getB']);
});
