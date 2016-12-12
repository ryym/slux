export class Dispatcher {
  constructor(store, handlers) {
    this._store = store;
    this._handlers = handlers;
    this.dispatch = this.dispatch.bind(this);
  }

  dispatch(command) {
    const { type, payload } = command;
    if (! this._handlers.hasOwnProperty(type)) {
      throw new Error(`command '${type}' is not defined`);
    }
    this._handlers[type](...payload);
  }

  getStore() {
    return this._store;
  }
}

export function createCommandHandlers(store, defineCommands) {
  const handlers = {};

  const to = (method, commandType) => {
    const type = commandType;
    handlers[type] = method;

    return (...payload) => ({ type, payload });
  };
  const { mutations, actions } = store;
  const commands = defineCommands(mutations, actions, to);

  return { commands, handlers };
}

export default function createDispatcher(store, defineCommands) {
  const { commands, handlers } = createCommandHandlers(store, defineCommands);
  const dispatcher = new Dispatcher(store, handlers);
  return { commands, dispatcher };
}
