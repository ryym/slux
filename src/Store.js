import mapObject from './mapObject'
import createActions from './createActions'
import createMutations from './createMutations'

export default class Store {
  constructor({
    getters,
    mutations = createMutations({}),
    actions = createActions({}),
    subStores = {}
  }) {
    if (typeof getters === 'undefined') {
      throw new Error('getters are required')
    }

    let _state = this.getInitialState()
    this.getState = () => _state

    // Getters
    const childGetters = mapObject(subStores, c => c.getters)
    this.getters = getters(this.getState, childGetters, {
      getInitialState: this.getInitialState.bind(this)
    })
    Object.freeze(this.getters)

    // Mutations
    const childMutations = mapObject(subStores, c => c.mutations)
    const onCommitStart = type => {
      this._currentCommit = { type, subCommits: [] }
    }
    const onCommitEnd = newState => {
      _state = newState
      this._notifyStateChange(newState, this._currentCommit)
      this._currentCommit = undefined
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
        this._notifyStateChange(this.getState(), subCommit)
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

    this.installCommands()
  }

  getInitialState() {
    return {}
  }

  _notifyStateChange(state, commit) {
    this._subscribers.forEach(s => s(state, commit))
  }

  getCommands() {
    return this._commandKeys
  }

  // XXX: 独立した関数でいい
  installCommands() {
    const handlers = this.defineCommands(this.mutations, this.actions)
    this._commandKeys = mapObject(handlers, (v, k) => k)
    this._commandHandlers = handlers
  }

  define() {
    return 'Store define'
  }

  defineCommands() {
    // サブストアは空でいい
    return {}
  }

  dispatch(command, ...args) {
    const handler = this._commandHandlers[command]
    if (handler) {
      handler(...args)
    }
  }

  subscribe(subscriber) {
    this._subscribers.push(subscriber)
    return () => {
      // TODO: remove subscriber
    }
  }
}

