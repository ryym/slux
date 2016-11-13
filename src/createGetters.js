import mapObject from './mapObject'

export default function createGetters(getters) {
  return (getState, childGetters = {}, additionalGetters) => {

    let _getters

    const ownGetters = mapObject(getters, g => {
      // 実際に外から呼べる関数
      const f = (...args) => g({
        state: getState(),
        getters: _getters
      }, ...args)
      // XXX: ブラウザだと(or babelを通すと)これ効かない?
      Object.defineProperty(f, 'name', { value: g.name })
      return f
    })

    _getters = Object.assign(
      ownGetters,
      childGetters,
      additionalGetters
    )

    return _getters
  }
}

