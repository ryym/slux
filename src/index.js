import {
  mutation,
  mutationWith,
  action,
  actionWith,
  createMutation,
  createAction,
} from './updaterCreators';
import {
  createDispatcher,
  createDispatcherWithCommands,
} from './dispatcherCreators';
import {
  createStore,
} from './storeCreators';

module.exports = {
  mutation,
  mutationWith,
  action,
  actionWith,
  createMutation,
  createAction,
  createDispatcher,
  createDispatcherWithCommands,
  createStore,
};
