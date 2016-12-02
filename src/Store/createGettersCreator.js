import { mapObject } from '../utils/object';

const delegateGetters = (getters) => getters.reduce((gs, getter) => {
  if (typeof getter === 'undefined') {
    throw new Error('getters.$delegate: getter is undefined');
  }
  gs[getter.name] = getter;
  return gs;
}, {});

export default function createGettersCreator(getters) {
  return function createGetters({ getState, subGetters = {}, defaultGetters = {} }) {
    let _getters;  // eslint-disable-line prefer-const

    let delegatedGetters = {};
    if (typeof getters.$delegate === 'function') {
      delegatedGetters = delegateGetters(getters.$delegate(subGetters));
      delete getters.$delegate;
    }

    const ownGetters = mapObject(getters, (getter, name) => {
      const wrappedGetter = (...args) => getter({
        state: getState(),
        getters: _getters,
      }, ...args);

      Object.defineProperty(wrappedGetter, 'name', { value: name });
      return wrappedGetter;
    });

    _getters = {
      ...ownGetters,
      ...subGetters,
      ...delegatedGetters,
      ...defaultGetters,
    };

    return _getters;
  };
}

