import { EventEmitter } from 'events';
import StoreRef from './StoreRef';
import bindContext from './utils/bindContext';

const events = {
  MUTATION: 'MUTATION',
  ACTION: 'ACTION',
  ERROR: 'ERROR',
};

const getRef = store => new StoreRef(store);

/**
 * Store
 *   - Hold a state
 *   - Apply accessor methods to get or update the state
 *   - Take snapshot of the state
 */
export default class Store {
  constructor({
    name,
    getInitialState,
    takeSnapshot,
    createAccessorContexts,
    defineSubStores,
  }) {
    bindContext(this, [
      'query',
      'commit',
      'run',
      '_handleSubStoreMutation',
      '_handleSubStoreError',
      '_notifyActionRun',
    ]);

    this._name = name || 'Anonymous Store';
    this.getInitialState = getInitialState;
    this._takeSnapshot = takeSnapshot;
    this._storeRefs = defineSubStores(getRef);

    const { getter, mutation, action } = createAccessorContexts(this, this._storeRefs);
    this._getterContext = getter;
    this._mutationContext = mutation;
    this._actionContext = action;

    this._emitter = new EventEmitter();
    this._state = getInitialState();
  }

  getName() {
    return this._name;
  }

  query(getter, payload) {
    return getter.exec(this.getState(), this._getterContext, payload);
  }

  commit(mutation, payload) {
    this._handleMutationStart(mutation.type, payload);
    const currentState = this.getState();
    try {
      const nextState = mutation.exec(currentState, this._mutationContext, payload);
      this._handleMutationEnd(mutation.type, nextState);
      return nextState;
    }
    catch (error) {
      this._handleError(mutation.type, error);
      return currentState;
    }
  }

  run(action, payload) {
    this._notifyActionRun({ type: action.type, payload });
    const returnValue = action.exec(this._actionContext, payload);
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

  _handleMutationStart(type, payload) {
    const mutationData = { store: this._name, type, payload, includes: [] };
    if (this._currentMutation) {
      this._currentMutation.includes.push(mutationData);
    }
    else {
      this._currentMutation = mutationData;
    }
  }

  _handleMutationEnd(type, nextState) {
    this._state = nextState;
    if (this._currentMutation.type === type) {
      this._notifyMutated(this._currentMutation);
      this._currentMutation = undefined;
    }
  }

  _handleSubStoreMutation(subMutationData) {
    if (this._currentMutation) {
      this._currentMutation.includes.push(subMutationData);
    }
    else {
      this._notifyMutated(subMutationData);
    }
  }

  _handleError(type, error) {
    const mutationData = this._currentMutation;
    this._currentMutation = undefined;
    this._notifyOrThrowError(type, error, mutationData);
  }

  _handleSubStoreError({ type, error, mutationData: subMutationData }) {
    let mutationData = this._currentMutation;
    if (mutationData) {
      mutationData.includes.push(subMutationData);
    }
    else {
      mutationData = subMutationData;
    }
    this._notifyOrThrowError(type, error, mutationData);
  }

  _notifyActionRun(actionData) {
    this._emitter.emit(events.ACTION, actionData);
  }

  _notifyMutated(mutationData) {
    this._emitter.emit(events.MUTATION, mutationData, this);
  }

  _notifyOrThrowError(type, error, mutationData) {
    if (this._hasErrorHandlers()) {
      this._emitter.emit(events.ERROR, { type, error, mutationData });
    }
    else {
      throw error;
    }
  }

  _hasErrorHandlers() {
    return this._emitter.listenerCount(events.ERROR) > 0;
  }
}
