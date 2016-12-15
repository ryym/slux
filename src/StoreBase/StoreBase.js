import EventEmitter from 'events';
import { bindMethodContext } from '../utils/class';
import {
  getSubMethods,
  normalizeConfigs,
} from './utils';

const eventKeys = {
  MUTATION: '$$MUTATION',
  ACTION: '$$ACTION',
};

export default class Store {
  constructor(rawConfigs) {
    const [error, configs] = normalizeConfigs(rawConfigs);
    if (error) {
      throw error;
    }

    this._configs = configs;
    this._emitter = new EventEmitter();

    bindMethodContext(this, [
      'takeSnapshot',
      'getOwnState',
      '_notifyActionFired',
      '_notifyStateMutated',
    ]);
  }

  onMutation(subscriber) {
    this._emitter.on(eventKeys.MUTATION, subscriber);
    const unsubscribeMutation = () => {
      this._emitter.removeListener(eventKeys.MUTATION, subscriber);
    };
    return unsubscribeMutation;
  }

  onAction(subscriber) {
    this._emitter.on(eventKeys.ACTION, subscriber);
    const unsubscribeAction = () => {
      this._emitter.removeListener(eventKeys.ACTION, subscriber);
    };
    return unsubscribeAction;
  }

  getOwnState() {
    return this._state;
  }

  takeSnapshot() {
    const ownState = this.getOwnState();
    const { subStores, takeSnapshot } = this._configs;
    const snapshot = takeSnapshot(ownState);
    return this.constructSnapshot(snapshot, subStores);
  }

  constructSnapshot(snapshot, subStores) {
    if (snapshot && typeof snapshot === 'object' && !Array.isArray(snapshot)) {
      Object.keys(subStores).forEach(name => {
        snapshot[name] = subStores[name].takeSnapshot();
      });
    }
    return snapshot;
  }

  constructStore() {
    this.initializeState();
    this.installGetters();
    this.installMutations(this.getters);
    this.installActions(this.getters, this.mutations);
    this.installSubStores();
  }

  initializeState() {
    this._state = this._configs.getInitialState();
  }

  installGetters() {
    const { subStores, createGetters, getInitialState } = this._configs;
    const subGetters = getSubMethods(subStores, 'getters');
    const defaultGetters = {
      getInitialState,
      getOwnState: this.getOwnState,
      takeSnapshot: this.takeSnapshot,
    };
    const getters = createGetters({
      getState: this.getOwnState,
      subGetters,
      defaultGetters,
    });

    this.getters = Object.freeze(getters);
  }

  installMutations(getters) {
    const { storeName, subStores, createMutations } = this._configs;
    const subMutations = getSubMethods(subStores, 'mutations');

    const handleMutationStart = (type, payload) => {
      const mutationData = { store: storeName, type, payload, usedMutations: [] };
      if (! this._currentMutation) {
        this._currentMutation = mutationData;
      }
      else {
        this._currentMutation.usedMutations.push(mutationData);
      }
    };

    const handleMutationEnd = (type, nextState) => {
      if (this._currentMutation.type === type) {
        this._state = nextState;
        this._notifyStateMutated(this, this._currentMutation);
        this._currentMutation = undefined;
      }
    };

    const mutations = createMutations({
      getState: this.getOwnState,
      getters,
      subMutations,
      onMutationStart: handleMutationStart,
      onMutationEnd: handleMutationEnd,
    });

    this.mutations = Object.freeze(mutations);
  }

  installActions(getters, mutations) {
    const { subStores, createActions } = this._configs;
    const subActions = getSubMethods(subStores, 'actions');
    const handleAction = (type, payload) => {
      this._notifyActionFired({ type, payload });
    };

    const actions = createActions({
      getters,
      mutations,
      subActions,
      onAction: handleAction,
    });

    this.actions = Object.freeze(actions);
  }

  installSubStores() {
    const { subStores } = this._configs;
    const onSubStoreMutation = (_, subMutation) => {
      if (this._currentMutation) {
        this._currentMutation.usedMutations.push(subMutation);
      }
      else {
        this._notifyStateMutated(this, subMutation);
      }
    };
    const onSubStoreAction = this._notifyActionFired;

    Object.keys(subStores).forEach(name => {
      subStores[name].onMutation(onSubStoreMutation);
      subStores[name].onAction(onSubStoreAction);
    });

    this.subStores = Object.freeze(subStores);
  }

  _notifyActionFired(actionData) {
    this._emitter.emit(eventKeys.ACTION, actionData);
  }

  _notifyStateMutated(store, mutationData) {
    this._emitter.emit(eventKeys.MUTATION, store, mutationData);
  }
}
