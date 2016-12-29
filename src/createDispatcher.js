import Dispatcher from './Dispatcher';

const createCommand = type => payload => ({ type, payload });

const createApplier = (handlers, applyAccessor) => accessor => {
  const type = accessor.type;
  if (handlers.hasOwnProperty(type)) {
    throw new Error(`Slux: A handler is already defiend for command '${type}'`);
  }
  handlers[type] = applyAccessor(accessor);
  return createCommand(type);
};

export default function createDispatcher(store, defineCommands) {
  const handlers = {};

  const commit = createApplier(
    handlers,
    mutation => payload => store.commit(mutation, payload)
  );
  const run = createApplier(
    handlers,
    action => payload => store.run(action, payload)
  );

  const commands = defineCommands(commit, run);
  const dispatcher = new Dispatcher(store, handlers);
  return { dispatcher, commands };
}
