import { mapObject } from '../utils/object';

export default function createActionsCreator(actions) {
  return function createActions({
    getters = {},
    mutations = {},
    subActions = {},
    onAction = () => {},
  }) {
    let _actions;  // eslint-disable-line prefer-const

    const ownActions = mapObject(actions, (action, name) => {
      const wrappedAction = (...args) => {
        onAction(name, args);
        const returnValue = action({ mutations, getters, actions: _actions }, ...args);
        return returnValue;
      };
      Object.defineProperty(wrappedAction, 'name', { value: name });
      return wrappedAction;
    });

    _actions = {
      ...ownActions,
      ...subActions,
    };

    return _actions;
  };
}

