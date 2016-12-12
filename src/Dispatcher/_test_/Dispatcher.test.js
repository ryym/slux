import test from 'ava';
import sinon from 'sinon';
import createDispatcher, {
  Dispatcher,
  createCommandHandlers,
} from '../createDispatcher';

test('Dispatcher: dispatch command', t => {
  const handlers = {
    EVENT_A: sinon.spy(),
  };

  const dispatcher = new Dispatcher({}, handlers);
  dispatcher.dispatch({
    type: 'EVENT_A',
    payload: [1, 2, { a: 1 }],
  });

  t.deepEqual(handlers.EVENT_A.args, [
    [1, 2, { a: 1 }],
  ]);
});

test('createCommandHandlers: create commands', t => {
  const store = {
    mutations: {
      mutationA: sinon.spy(),
    },
    actions: {
      actionA: sinon.spy(),
    },
  };

  const defineCommands = (m, a, to) => ({
    cMutationA: to(m.mutationA, 'M_A'),
    cActionA: to(a.actionA, 'A_A'),
  });
  const { commands } = createCommandHandlers(store, defineCommands);

  t.deepEqual({
    cMutationA: commands.cMutationA(),
    cActionA: commands.cActionA(1, 'a', true),
  }, {
    cMutationA: {
      type: 'M_A',
      payload: [],
    },
    cActionA: {
      type: 'A_A',
      payload: [1, 'a', true],
    },
  }, 'command just creates an object');

  t.deepEqual([
    store.mutations.mutationA.callCount,
    store.actions.actionA.callCount,
  ], [0, 0], 'methods do not be called');
});

test('createDispatcher: create dispatcher and commands', t => {
  const store = {
    mutations: { mutateA: sinon.spy() },
    actions: { actionB: sinon.spy() },
  };
  const { dispatcher } = createDispatcher(store, (m, a, to) => ({
    dispatchA: to(m.mutateA, 'DISPATCH_A'),
    dispatchB: to(a.actionB, 'DISPATCH_B'),
  }));

  dispatcher.dispatch({
    type: 'DISPATCH_A',
    payload: ['a', 1],
  });
  dispatcher.dispatch({
    type: 'DISPATCH_B',
    payload: ['b', 2],
  });

  t.deepEqual(store.mutations.mutateA.args, [['a', 1]]);
  t.deepEqual(store.actions.actionB.args, [['b', 2]]);
});
