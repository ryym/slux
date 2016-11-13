import mapObject from './mapObject'
import createActions from './createActions'
import createMutations from './createMutations'

export const STORE_CERTIFICATION = 'abcde'

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
    const childGetters = mapObject(subStores, c => c._getGetters(STORE_CERTIFICATION))
    this._getters = getters(this.getState, childGetters, {
      getInitialState: this.getInitialState.bind(this)
    })

    // Mutations
    const childMutations = mapObject(subStores, c => c._getMutations(STORE_CERTIFICATION))
    const onCommitStart = type => {
      this._currentCommit = { type, subCommits: [] }
    }
    const onCommitEnd = newState => {
      _state = newState
      this._notifyStateChange(newState, this._currentCommit)
      this._currentCommit = undefined
    }
    const _mutations = mutations(
      this.getState, this._getters, childMutations, onCommitStart, onCommitEnd
    )
    this._mutations = _mutations

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
    const childActions = mapObject(subStores, c => c._getActions(STORE_CERTIFICATION))
    this._actions = actions(this._getters, this._mutations, childActions)

    // Sub stores
    this._subStores = subStores

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
    // XXX: 直接渡さない方が行儀いい気もするけど、
    // mutationもactionも`writable:false`にしちゃえば直接渡してもいいかも
    const handlers = this.defineCommands(this._mutations, this._actions)
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

  // XXX: Must be un-enumerable

  _getGetters(cert) {
    this._check(cert)
    return this._getters
  }

  _getMutations(cert) {
    this._check(cert)
    return this._mutations
  }

  _getActions(cert) {
    this._check(cert)
    return this._actions
  }

  _check(cert) {
    if (cert !== STORE_CERTIFICATION) {
      throw new Error('dont touch!')
    }
  }
}

