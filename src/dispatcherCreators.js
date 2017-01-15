import Dispatcher from './Dispatcher';

export const createDispatcherWithCommands = (store, defineCommands) => {
  const dispatcher = new Dispatcher(store);
  const commands = defineCommands(dispatcher.register);
  return { dispatcher, commands };
};

export const createDispatcher = store => new Dispatcher(store);
