import { mapObject, filterObject } from '../utils/object';

/**
 * Extract methods of sub stores except
 * sub store's sub store's ones (grand children methods).
 */
export const getSubMethods = (subStores, name) =>
  mapObject(subStores, s =>
    filterObject(s[name], m => typeof m === 'function')
  );

export const normalizeConfigs = (rawConfigs) => {
  const {
    name,
    createGetters = () => ({}),
    createMutations = () => ({}),
    createActions = () => ({}),
    subStores = {},
    getInitialState = () => ({}),
    takeSnapshot = state => state,
  } = rawConfigs;

  if (! name) {
    return [new Error('Store name is not specified.'), null];
  }

  const configs = {
    storeName: name,
    createGetters,
    createMutations,
    createActions,
    subStores,
    getInitialState,
    takeSnapshot,
  };
  return [null, configs];
};
