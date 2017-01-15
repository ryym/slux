const { EventEmitter } = require('events');

const events = {
  MUTATION: 'MUTATION',
  ACTION: 'ACTION',
  ERROR: 'ERROR',
};

export default class Store {
  constructor(name, {
    getInitialState,
    takeSnapshot,
  }) {
    this._name = name;
    this.getInitialState = getInitialState;
    this._takeSnapshot = takeSnapshot;

    this._emitter = new EventEmitter();
    this._state = getInitialState();

    this.getState = this.getState.bind(this);
    this.commit = this.commit.bind(this);
    this.run = this.run.bind(this);
  }

  getName() {
    return this._name;
  }

  commit(mutation, payload) {
    const currentState = this.getState();
    const { type, exec } = mutation;

    try {
      this._state = exec(currentState, payload);
    }
    catch (error) {
      this._notifyOrThrowError(type, payload, error);
      return currentState;
    }

    this._notifyMutated(type, payload);
    return this._state;
  }

  run(action, payload) {
    const { type, exec } = action;
    this._notifyActionRun({ type, payload });
    return exec(this, this.getState(), payload);
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
