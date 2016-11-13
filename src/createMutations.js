import mapObject from './mapObject'

export default function createMutations(mutations) {
  return (getState, getters, childMutations, handleCommitStart, handleCommitEnd) => {
    let _mutations
    const handlers = []

    const ownMutations = mapObject(mutations, (m) => {
      const f = (...args) => {
        handleCommitStart(m.name)

        const state = getState()
        const newState = m({
          state, getters,
          mutations: _mutations
        }, ...args) || state

        handleCommitEnd(newState)
      }
      Object.defineProperty(f, 'name', { value: m.name })
      return f
    })

    _mutations = Object.assign(
      ownMutations,
      childMutations,
    )

    return _mutations
  }
}

