import test from 'ava';
import sinon from 'sinon';
import createActionsCreator from '../createActionsCreator';

test('create actions that execute mutations', t => {
  const actions = {
    doAdd({ mutations, getters }, count) {
      mutations.add(getters.getA() * count);
    },
  };
  const mutations = { add: sinon.spy() };
  const getters = { getA: () => 10 };
  const wrappedActions = createActionsCreator(actions)({
    mutations, getters,
  });

  wrappedActions.doAdd(3);
  t.deepEqual(mutations.add.args, [[30]]);
});

test('create actions with specified names', t => {
  const actions = {
    actionA() {},
    actionB() {},
  };
  const wrappedActions = createActionsCreator(actions)({});
  const actionNames = Object
    .keys(wrappedActions)
    .map(k => wrappedActions[k].name);
  t.deepEqual(actionNames, ['actionA', 'actionB']);
});

test('execute callback before action', t => {
  const actions = {
    actionA() {},
  };
  const onAction = sinon.spy();
  const wrappedActions = createActionsCreator(actions)({
    onAction,
  });

  const actionArgs = [1, 2, 3];
  wrappedActions.actionA(...actionArgs);
  t.deepEqual(onAction.args, [['actionA', actionArgs]]);
});
