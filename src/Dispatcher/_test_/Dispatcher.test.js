import test from 'ava';
import sinon from 'sinon';
import Dispatcher from '../Dispatcher';

test('execute action or mutation via dispatch', t => {
  const store = {
    mutations: { mutateA: sinon.spy() },
    actions: { actionB: sinon.spy() },
  };
  const dispatcher = new Dispatcher(store, (mutations, actions) => ({
    DISPATCH_A: mutations.mutateA,
    DISPATCH_B: actions.actionB,
  }));

  dispatcher.dispatch('DISPATCH_A', 'a', 1);
  dispatcher.dispatch('DISPATCH_B', 'b', 2);

  t.deepEqual(store.mutations.mutateA.args, [['a', 1]]);
  t.deepEqual(store.actions.actionB.args, [['b', 2]]);
});

test('provide command string object', t => {
  const store = { mutations: {}, actions: {} };
  const dispatcher = new Dispatcher(store, () => ({
    DISPATCH_A: null,
    DISPATCH_B: null,
  }));

  t.deepEqual(dispatcher.getCommands(), {
    DISPATCH_A: 'DISPATCH_A',
    DISPATCH_B: 'DISPATCH_B',
  });
});
