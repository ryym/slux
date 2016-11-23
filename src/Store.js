import mapObject from './mapObject'
import createActions from './createActions'
import createMutations from './createMutations'

function disallowGrandChildren(methods) {
  return Object.keys(methods).reduce((ms, name) => {
    if (typeof methods[name] === 'function') {
      ms[name] = methods[name]
    }
    return ms
  }, {})
}

export default class Store {
  constructor({
    name: storeName,
    getters,
    mutations = createMutations({}),
    actions = createActions({}),
    subStores = {},
    getInitialState = () => ({}),
    takeSnapshot = () => { throw new Error(`${name}.takeSnapshot: Not implemented.`) }
  }) {
    if (!storeName) {
      throw new Error('Store name is not specified.')
    }
    if (typeof getters === 'undefined') {
      throw new Error('getters are required')
    }

    this._takeSnapshot = takeSnapshot

    let _state = getInitialState()
    this.getOwnState = () => _state
    this.getStateArray = () => [_state, mapObject(subStores, s => s.getStateArray())]

    // Getters
    const childGetters = mapObject(subStores, c => disallowGrandChildren(c.getters))
    this.getters = getters(this.getOwnState, childGetters, { getInitialState })
    Object.freeze(this.getters)

    // Mutations
    const childMutations = mapObject(subStores, c => disallowGrandChildren(c.mutations))
    const onCommitStart = (type, payload) => {
      const commitData = { store: storeName, type, payload, subCommits: [] }
      if (! this._currentCommit) {
        this._currentCommit = commitData
      }
      else {
        this._currentCommit.subCommits.push(commitData)
      }
    }
    const onCommitEnd = (type, newState) => {
      if (this._currentCommit.type === type) {
        _state = newState
        this._notifyStateChange(this, this._currentCommit)
        this._currentCommit = undefined
      }
    }
    this.mutations = mutations(
      this.getOwnState, this.getters, childMutations, onCommitStart, onCommitEnd
    )
    Object.freeze(this.mutations)

    // Listen to sub store changes.
    const onSubStoreStateChange = (_, subCommit) => {
      if (this._currentCommit) {
        this._currentCommit.subCommits.push(subCommit)
      }
      else {
        this._notifyStateChange(this, subCommit)
      }
    }
    Object.keys(subStores).forEach(name => {
      subStores[name].subscribe(onSubStoreStateChange)
    })

    // Actions
    const childActions = mapObject(subStores, c => disallowGrandChildren(c.actions))
    const onAction = (type, payload) => {
      this._notifyAction({ type, payload })
    }
    this.actions = actions(this.getters, this.mutations, childActions, onAction)
    Object.freeze(this.actions)

    Object.keys(subStores).forEach(name => {
      subStores[name].onAction(a => this._notifyAction(a))
    })

    // Sub stores
    this.subStores = Object.freeze(subStores)

    this._subscribers = []
    this._actionSubscribers = []
  }

  _notifyAction(actionData) {
    this._actionSubscribers.forEach(s => s(actionData))
  }

  _notifyStateChange(store, commit) {
    this._subscribers.forEach(s => s(store, commit))
  }

  onAction(subscriber) {
    this._actionSubscribers.push(subscriber)
    return () => {
      // TODO: remove subscriber
    }
  }

  // XXX: onMutation
  subscribe(subscriber) {
    this._subscribers.push(subscriber)
    return () => {
      // TODO: remove subscriber
    }
  }

  takeSnapshot() {
    const ownState = this.getOwnState()
    return this.constructSnapshot(this._takeSnapshot(ownState), this.subStores)
  }

  constructSnapshot(snapshot, subStores) {
    Object.keys(subStores).forEach(name => {
      snapshot[name] = subStores[name].takeSnapshot()
    })
    return snapshot
  }
}

