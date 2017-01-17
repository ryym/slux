import { methodTypes } from './updaterCreators';

// XXX: Hold payload only for type checks.
const createCommand = type => payload => ({ type, payload });

const createMutationHandler = (store, mutation) => ({
  type: `mutation:${mutation.type}`,
  handler: payload => store.commit(mutation, payload),
});

const createEffectHandler = (store, effect) => ({
  type: `effect:${effect.type}`,
  handler: payload => store.run(effect, payload),
});

const createHandler = (store, updater) => {
  switch (updater.methodType) {
  case methodTypes.MUTATION:
    return createMutationHandler(store, updater);
  case methodTypes.EFFECT:
    return createEffectHandler(store, updater);
  }
};

export default class Dispatcher {
  constructor(store) {
    this._store = store;
    this._handlers = {};
    this.register = this.register.bind(this);
    this.dispatch = this.dispatch.bind(this);
  }

  register(updater) {
    const { type, handler } = createHandler(this._store, updater);
    this._handlers[type] = handler;
    return createCommand(type);
  }

  dispatch(command, payload) {
    const { type } = command(payload);
    const handler = this._handlers[type];
    if (typeof handler !== 'function') {
      throw new Error(`Slux(dispatch): Unknown command: ${command.type}`);
    }
    handler(payload);
  }

  getStore() {
    return this._store;
  }
}
