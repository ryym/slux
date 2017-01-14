import StoreFacade from './StoreFacade';
import { _STORE_REF_ACCESS_KEY } from './StoreRef';

const curryApplier = applier => accessor => payload => applier(accessor, payload);

const curryAppliers = store => {
  const query = curryApplier(store.query);
  const commit = curryApplier(store.commit);
  const run = curryApplier(store.run);
  return { query, commit, run };
};

const curryCombinedApplier = getApplier => (ref, accessor) => {
  const applier = getApplier(ref.getStore(_STORE_REF_ACCESS_KEY));
  return payload => applier(accessor, payload);
};

const curryCombinedAppliers = () => {
  const query = curryCombinedApplier(store => store.query);
  const commit = curryCombinedApplier(store => store.commit);
  const run = curryCombinedApplier(store => store.run);
  return { query, commit, run };
};

export const createFacade = (store, defineMethods) => {
  const appliers = curryAppliers(store);
  const methods = defineMethods(appliers);
  return new StoreFacade(store, methods);
};

export const createCombinedFacade = (store, defineMethods) => {
  const appliers = curryCombinedAppliers();
  const stores = store._getStoreRefs();
  const methods = defineMethods({ ...appliers, stores });
  return new StoreFacade(store, methods);
};
