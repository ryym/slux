import Dispatcher from './Dispatcher';

const createCommand = type => payload => ({ type, payload });

// Create commit and run
const createApplier = (handlers, makeKey, applyAccessor) => (...args) => {
  const key = makeKey(...args);
  if (handlers.hasOwnProperty(key)) {
    throw new Error(`Slux: A handler is already defiend for command '${key}'`);
  }
  handlers[key] = applyAccessor(...args);
  return createCommand(key);
};

const createDispatcherCreator = (
  makeKey, applyMutation, applyAction
) => (
  store, defineCommands
) => {
  const handlers = {};
  const commit = createApplier(handlers, makeKey, applyMutation(store));
  const run = createApplier(handlers, makeKey, applyAction(store));

  const commands = defineCommands(commit, run);
  const dispatcher = new Dispatcher(store, handlers);
  return { dispatcher, commands };
};

export const createDispatcher = createDispatcherCreator(
  accessor => accessor.type,
  store => mutation => payload => store.commit(mutation, payload),
  store => action => payload => store.run(action, payload)
);

export const createCombinedDispatcher = createDispatcherCreator(
  (store, accessor) => `${store.getName()}/${accessor.type}`,
  () => (store, mutation) => payload => store.commit(mutation, payload),
  () => (store, action) => payload => store.run(action, payload)
);
