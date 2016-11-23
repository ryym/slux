import mapObject from './mapObject'

export default function createActions(actions) {
  return (getters, mutations, childActions, handleAction) => {
    let _actions
    const handlers = []

    const ownActions = mapObject(actions, (a, name) => {
      const f = (...args) => {
        const returnValue = a({ mutations, getters, actions: _actions }, ...args)
        handleAction(name, args)
        return returnValue
      }
      Object.defineProperty(f, 'name', { value: name })
      return f
    })

    _actions = Object.assign(
      ownActions,
      childActions,
    )

    return _actions
  }
}

