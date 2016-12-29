// Slux Version 2 Prototype

class Store {
  constructor(config) {
    this._state = config.getInitialState()
    this._takeSnapshot = config.takeSnapshot
    this.query = this.query.bind(this)
    this.commit = this.commit.bind(this)
    this.run = this.run.bind(this)
  }

  query(getter, payload) {
    return getter(this.getState(), this._getterContext, payload)
  }

  commit(mutation, payload) {
    // onMutationStart
    const nextState = mutation(this.getState(), this._mutationContext, payload)
    // onMutationStart
    this._state = nextState
    return nextState
  }

  run(action, payload) {
    // onAction
    return action(this._actionContext, payload)
  }

  getState() {
    return this._state
  }

  takeSnapshot() {
    return this._takeSnapshot(this.getState())
  }

  _setContexts({ getter, mutation, action }) {
    this._getterContext = getter
    this._mutationContext = mutation
    this._actionContext = action
  }
}

class SingleStore extends Store {
  constructor(config) {
    super(
      Object.assign({}, config, { stores: {} })
    )
    const { query, commit, run } = this
    this._setContexts({
      getter: { query },
      mutation: { query, commit },
      action: { query, commit, run }
    })
  }
}

class CombinedStore extends Store {
  constructor(config) {
    super(config)
    const seal = store => new SealedStore(store)
    const stores = Object.assign({}, config.stores(seal), {
      self: seal(this)
    })

    const query = (sstore, getter, payload) => {
      return sstore.getStore(_SEALED_STORE_ACCESS_KEY).query(getter, payload)
    }
    const commit = (sstore, mutation, payload) => {
      return sstore.getStore(_SEALED_STORE_ACCESS_KEY).commit(mutation, payload)
    }
    const run = (sstore, action, payload) => {
      return sstore.getStore(_SEALED_STORE_ACCESS_KEY).run(action, payload)
    }

    this._setContexts({
      getter: { stores, query },
      mutation: { stores, query, commit },
      action: { stores, query, commit, run }
    })

    this.withSubs = (process) => {
      process({ stores, query, commit, run })
    }
  }
}

const _SEALED_STORE_ACCESS_KEY = '-SEALED_STORE_ACCESS_KEY-'

class SealedStore {
  constructor(store) {
    this._store = store
  }
  getStore(accessKey) {
    if (accessKey === _SEALED_STORE_ACCESS_KEY) {
      return this._store
    }
    throw new Error('getStore can be used only inside of Slux')
  }
}

export function createStore(config) {
  return new SingleStore(config)
}

export function combineStores(config) {
  return new CombinedStore(config)
}

export function getter(func) {
  return func
}
export function getterWith(dep, funcWithoutDep) {
  const func = funcWithoutDep(dep)
  func.with = funcWithoutDep
  return func
}

export function mutation(type, func) {
  const boundFunc = func.bind(null)
  boundFunc.type = type
  return boundFunc
}
export function mutationWith(dep, type, funcWithoutDep) {
  const func = funcWithoutDep(dep)
  func.with = funcWithoutDep
  func.type = type
  return func
}

export function action(type, func) {
  const boundFunc = func.bind(null)
  boundFunc.type = type
  return boundFunc
}
export function actionWith(dep, type, funcWithoutDep) {
  const func = funcWithoutDep(dep)
  func.with = funcWithoutDep
  func.type = type
  return func
}

export function createDispatcher(store, define) {
  const handlers = {}

  const commit = (mutation) => {
    const { type } = mutation
    handlers[type] = (payload) => {
      store.commit(mutation, payload)
    }
    return (payload) => ({ type, payload })
  }
  const run = (action) => {
    const { type } = action
    handlers[type] = (payload) => {
      store.run(action, payload)
    }
    return (payload) => ({ type, payload })
  }

  const commands = define(commit, run)

  const dispatcher = {
    dispatch({ type, payload }) {
      handlers[type](payload)
    }
  }

  return { dispatcher, commands }
}

export function createConnector(defineStores) {
  const seal = store => new SealedStore(store)
  const sealedStores = defineStores(seal)

  return function connect(mapStateToProps /*, mapDispatchToProps */) {
    return function wrapWithConnect(Component) {
      class Connect { //extends Component 
        constructor(props, context) {
          const store = getStore(context)
          const mappedProps = mapStateToProps(store.query, sealedStores, props)
          // ...
        }
      }
    }
  }
}
