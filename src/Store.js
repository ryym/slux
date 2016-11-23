import mapObject from './mapObject'
import createActions from './createActions'
import createMutations from './createMutations'

export default class Store {
  constructor({
    name: storeName = null,
    getters,
    mutations = createMutations({}),
    actions = createActions({}),
    subStores = {},
    getInitialState = () => ({}),
    takeSnapshot = () => { throw new Error(`${name}.takeSnapshot: Not implemented.`) }
  }) {
    if (typeof getters === 'undefined') {
      throw new Error('getters are required')
    }

    this._takeSnapshot = takeSnapshot

    let _state = getInitialState()
    this.getOwnState = () => _state
    this.getStateArray = () => [_state, mapObject(subStores, s => s.getStateArray())]

    // Getters
    const childGetters = mapObject(subStores, c => c.getters)
    this.getters = getters(this.getOwnState, childGetters, { getInitialState })
    Object.freeze(this.getters)

    // Mutations
    const childMutations = mapObject(subStores, c => c.mutations)
    const onCommitStart = (type, args) => {
      const commitData = { store: storeName, type, args, subCommits: [] }
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
    const childActions = mapObject(subStores, c => c.actions)
    this.actions = actions(this.getters, this.mutations, childActions)
    Object.freeze(this.actions)

    // Sub stores
    this.subStores = Object.freeze(subStores)

    this._subscribers = []
  }

  _notifyStateChange(store, commit) {
    this._subscribers.forEach(s => s(store, commit))
  }

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

