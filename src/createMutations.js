import mapObject from './mapObject'

export default function createMutations(mutations) {
  return (getState, getters, childMutations) => {
    let _mutations
    const handlers = []

    const ownMutations = mapObject(mutations, (m) => {
      const f = (...args) => {
        const state = getState()
        const newState = m({
          state, getters,
          mutations: _mutations
        }, ...args) || state
        handlers.forEach(h => h(newState))
      }
      Object.defineProperty(f, 'name', { value: m.name })
      return f
    })

    _mutations = Object.assign(
      ownMutations,
      childMutations,
    )

    const subscribeStateChange = (handler) => {
      handlers.push(handler)
      return function unsubscribe() {
        // XXX: ここまでcreateMutationでやらないといけないのはイマイチ
        // const idx = handlers.indexOf(handler)
        // idx && handlers.splice()
      }
    }
    return [_mutations, subscribeStateChange]
  }
}

