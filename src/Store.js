import { EventEmitter } from 'events';
import SealedStore from './SealedStore';

const events = {
  MUTATION: 'MUTATION',
  ACTION: 'ACTION',
};

const seal = store => new SealedStore(store);

const bindContext = (context, methods) => {
  methods.forEach(name => {
    context[name] = context[name].bind(context);
  });
};

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
      '_notifyActionRun',
    ]);

    this._name = name || 'Anonymous Store';
    this.getInitialState = getInitialState;
    this._takeSnapshot = takeSnapshot;
    this._sealedStores = defineSubStores(seal);

    const { getter, mutation, action } = createAccessorContexts(this, this._sealedStores);
    this._getterContext = getter;
    this._mutationContext = mutation;
    this._actionContext = action;

    this._emitter = new EventEmitter();
    this._state = getInitialState();
  }

  query(getter, payload) {
    return getter(this.getState(), this._getterContext, payload);
  }

  commit(mutation, payload) {
    this._handleMutationStart(mutation.type, payload);
    const nextState = mutation(this.getState(), this._mutationContext, payload);
    this._handleMutationEnd(mutation.type, nextState);
    this._state = nextState;
    return nextState;
  }

  run(action, payload) {
    this._notifyActionRun({ type: action.type, payload });
    const returnValue = action(this._actionContext, payload);
    return returnValue;
  }

  onMutation(handler) {
    this._emitter.on(events.MUTATION, handler);
    return () => {
      this._emitter.removeListener(events.MUTATION, handler);
    };
  }

  onAction(handler) {
    this._emitter.on(events.ACTION, handler);
    return () => {
      this._emitter.removeListener(events.ACTION, handler);
    };
  }

  // TODO: implement
  onStateChange() {}

  getState() {
    return this._state;
  }

  takeSnapshot() {
    return this._takeSnapshot(this.getState());
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
    if (this._currentMutation.type === type) {
      this._state = nextState;
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

  _notifyActionRun(actionData) {
    this._emitter.emit(events.ACTION, actionData);
  }

  _notifyMutated(mutationData) {
    this._emitter.emit(events.MUTATION, mutationData, this);
  }
}
