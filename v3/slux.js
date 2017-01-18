const { EventEmitter } = require('events')

const createStore = (name, config) => new Store(name, config)

const events = {
  MUTATION: 'mutation',
  ACTION: 'action',
  ERROR: 'error'
}

class Store {
  constructor(name, {
    getInitialState,
    takeSnapshot,
  }) {
    this.commit = this.commit.bind(this)
    this.run = this.run.bind(this)

    this._name = name
    this.getInitialState = getInitialState;
    this._takeSnapshot = takeSnapshot;

    this._emitter = new EventEmitter();
    this._state = getInitialState();
  }

  getName() {
    return this._name;
  }

  commit(mutation, payload) {
    const currentState = this.getState();
    const { type, exec } = mutation
    try {
      const nextState = exec(currentState, payload)
      this._state = nextState
      this._notifyMutated(type, payload);
      return nextState;
    }
    catch (error) {
      this._notifyOrThrowError(type, payload, error);
      return currentState;
    }
  }

  run(action, payload) {
    const { type, exec } = action
    this._notifyActionRun({ type, payload });
    const returnValue = exec(this, this.getState(), payload);
    return returnValue;
  }

  onMutation(handler) {
    return this._registerHandler(events.MUTATION, handler);
  }

  onAction(handler) {
    return this._registerHandler(events.ACTION, handler);
  }

  onError(handler) {
    return this._registerHandler(events.ERROR, handler);
  }

  // TODO: implement (allow to skip some mutation)
  onStateChange(handler) {
    return this.onMutation(handler);
  }

  getState() {
    return this._state;
  }

  takeSnapshot() {
    return this._takeSnapshot(this.getState());
  }

  _registerHandler(eventType, handler) {
    this._emitter.on(eventType, handler);
    return () => {
      this._emitter.removeListener(eventType, handler);
    };
  }

  _notifyActionRun(actionData) {
    this._emitter.emit(events.ACTION, actionData);
  }

  _notifyMutated(type, payload) {
    this._emitter.emit(events.MUTATION, { type, payload }, this);
  }

  _notifyOrThrowError(type, payload, error) {
    if (this._hasErrorHandlers()) {
      this._emitter.emit(events.ERROR, { type, error, payload });
    }
    else {
      throw error;
    }
  }

  _hasErrorHandlers() {
    return this._emitter.listenerCount(events.ERROR) > 0;
  }
}


const createMutation = (selectState, mergeState) => {
  return (type, func) => {
    const exec = (wholeState, payload) => {
      const state = selectState(wholeState)
      const newState = func(state, payload)
      return mergeState(wholeState, newState)
    }
    return {
      methodType: 'mutation',
      type,
      exec,

      // XXX: 本来は必要ないけど、funcの受け取る型と実際のState型の両方を
      // 型情報として保持したいため。
      selectState,
      mergeState,
    }
    // const mutationFunc = payload => ({
    //   methodType: 'mutation',
    //   type,
    //   payload,
    //   exec,
    // })
    // mutationFunc.methodType = 'mutation'
    // mutationFunc.type = type
    // return mutationFunc
  }
}
const mutation = createMutation(
  state => state,
  (_, state) => state
)

const createAction = (/* filterState */) => {
  return (type, func) => {
    return {
      methodType: 'action',
      type,
      exec: func,
    }
    // const actionFunc = payload => ({
    //   methodType: 'action',
    //   type,
    //   payload,
    //   exec: func,
    // })
    // actionFunc.methodType = 'mutation'
    // actionFunc.type = type
    // return actionFunc
  }
}
const action = createAction()



const createCommand = type => payload => ({ type, payload })
const createHandler = (store, method) => {
  if (method.methodType === 'mutation') {
    return {
      type: `mutation:${method.type}`,
      handler: payload => store.commit(method, payload)
    }
  }
  return {
    type: `action:${method.type}`,
    handler: payload => store.run(method, payload)
  }
}

class Dispatcher {
  constructor(store) {
    this._store = store
    this._handlers = {}
    this.define = this.define.bind(this)
  }

  define(method) {
    const { type, handler } = createHandler(this._store, method)
    this._handlers[type] = handler
    return createCommand(type)
  }

  dispatch(command, payload) {
    const { type } = command(payload)
    this._handlers[type](payload)
  }
}

const createDispatcherWithCommands = (store, defineCommands) => {
  const dispatcher = new Dispatcher(store)
  const commands = defineCommands(dispatcher.define)
  return { dispatcher, commands }
}

const createDispatcher = store => new Dispatcher(store)



// XXX: mapState, mapDispatchを分けるとWrappedComponentのProps型問題が復活する。
const createConnect = (dispatcher, filterState = state => state) => {
  return function connect(mapStateToProps, mapDispatchToProps) {
    return Component => connectComponent({
      dispatcher,
      mapStateToProps: (state, props) => mapStateToProps(filterState(state), props),
      mapDispatchToProps
    })
  }
}

module.exports = {
  createStore,
  createMutation,
  mutation, action,
  createDispatcherWithCommands,
}
