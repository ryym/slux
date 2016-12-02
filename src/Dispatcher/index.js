import Dispatcher from './Dispatcher';

export default function createDispatcher(store, defineCommands) {
  return new Dispatcher(store, defineCommands);
}
