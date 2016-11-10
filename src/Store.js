import mapObject from './mapObject'

export const STORE_CERTIFICATION = 'abcde'

export default class Store {
  constructor({
    state,
    getters,
    mutations,
    actions,
    subStores = {}
  }) {
    this._state = state
    this.getState = this.getState.bind(this)

    // Required
    if (getters) {
      const childGetters = mapObject(subStores, c => c._getGetters(STORE_CERTIFICATION))
      this._getters = getters(this.getState, childGetters)
    }

    // Required
    if (mutations) {
      const childMutations = mapObject(subStores, c => c._getMutations(STORE_CERTIFICATION))
      const [_mutations, subscribe] = mutations(
        this.getState, this._getters, childMutations
      )
      this._mutations = _mutations
      subscribe(s => this._state = s)
      this._subscribe = subscribe
    }

    // Optional
    if (actions) {
      const childActions = mapObject(subStores, c => c._getActions(STORE_CERTIFICATION))
      this._actions = actions(this._getters, this._mutations, childActions)
    }

    this.installCommands()
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

  getState() {
    return this._state
  }

  subscribe(handler) {
    return this._subscribe(handler)
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

