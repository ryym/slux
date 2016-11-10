import mapObject from './mapObject'

export default function createActions(actions) {
  return (getters, mutations, childActions) => {
    let _actions
    const handlers = []

    const ownActions = mapObject(actions, (a) => {
      const f = (...args) => {
        return a({ mutations, getters, actions: _actions }, ...args)
      }
      Object.defineProperty(f, 'name', { value: a.name })
      return f
    })

    _actions = Object.assign(
      ownActions,
      childActions,
    )

    return _actions
  }
}

