import mapObject from './mapObject'

export default function createGetters(getters) {
  return (getState, childGetters = {}, additionalGetters) => {

    let _getters

    let delegations = {}
    if (getters.$delegate) {
      delegations = getters.$delegate(childGetters).reduce((gs, g) => {
        if (typeof g === 'undefined') {
          throw new Error('getter.$delegate: getter is undefined')
        }
        gs[g.name] = g
        return gs
      }, {})
    }

    const ownGetters = mapObject(getters, g => {
      // 実際に外から呼べる関数
      const f = (...args) => g({
        state: getState(),
        getters: _getters
      }, ...args)
      Object.defineProperty(f, 'name', { value: g.name })
      return f
    })

    _getters = Object.assign(
      ownGetters,
      childGetters,
      delegations,
      additionalGetters
    )

    return _getters
  }
}

