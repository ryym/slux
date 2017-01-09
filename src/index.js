import {
  createStore,
  combineStores,
} from './storeCreators';
import {
  getter,
  getterWith,
  mutation,
  mutationWith,
  action,
  actionWith,
} from './accessorCreators';
import {
  createDispatcher,
  createCombinedDispatcher,
} from './dispatcherCreators';
import {
  createFacade,
  createCombinedFacade,
} from './storeFacadeCreators';

module.exports = {
  createStore,
  combineStores,
  getter,
  getterWith,
  mutation,
  mutationWith,
  action,
  actionWith,
  createDispatcher,
  createCombinedDispatcher,
  createFacade,
  createCombinedFacade,
};
