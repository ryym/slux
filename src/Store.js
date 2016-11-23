import mapObject from './mapObject'
import createActions from './createActions'
import createMutations from './createMutations'

export default class Store {
  constructor({
    getters,
    mutations = createMutations({}),
    actions = createActions({}),
    subStores = {},
    getInitialState = () => ({})
  }) {
    if (typeof getters === 'undefined') {
      throw new Error('getters are required')
    }

    let _state = getInitialState()
    this.getState = () => _state
    this.getStateArray = () => [_state, mapObject(subStores, s => s.getStateArray())]

    // Getters
    const childGetters = mapObject(subStores, c => c.getters)
    this.getters = getters(this.getState, childGetters, { getInitialState })
    Object.freeze(this.getters)

    // Mutations
    const childMutations = mapObject(subStores, c => c.mutations)
    const onCommitStart = (type, args) => {
      // XXX: It is useful if we can know which store creates a commit.
      if (! this._currentCommit) {
        this._currentCommit = { type, args, subCommits: [] }
      }
      else {
        this._currentCommit.subCommits.push({ type, args, subCommits: [] })
      }
    }
    const onCommitEnd = (type, newState) => {
      if (this._currentCommit.type === type) {
        _state = newState
        this._notifyStateChange(this.getStateArray(), this._currentCommit)
        this._currentCommit = undefined
      }
    }
    this.mutations = mutations(
      this.getState, this.getters, childMutations, onCommitStart, onCommitEnd
    )
    Object.freeze(this.mutations)

    // Listen to sub store changes.
    const onSubStoreStateChange = (_, subCommit) => {
      if (this._currentCommit) {
        this._currentCommit.subCommits.push(subCommit)
      }
      else {
        this._notifyStateChange(this.getStateArray(), subCommit)
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

  _notifyStateChange(state, commit) {
    this._subscribers.forEach(s => s(state, commit))
  }

  subscribe(subscriber) {
    this._subscribers.push(subscriber)
    return () => {
      // TODO: remove subscriber
    }
  }
}

