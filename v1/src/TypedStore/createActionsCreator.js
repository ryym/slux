import { mapObject } from '../utils/object';

export default function createActionsCreator(actions) {
  return function createActions({
    getters = {},
    mutations = {},
    subActions = {},
    onAction = () => {},
  }) {
    let _actions;  // eslint-disable-line prefer-const

    const context = { mutations, getters, actions: _actions }

    const ownActions = mapObject(actions, (action, name) => {
      const actualAction = action(context)
      const wrappedAction = (payload) => {
        onAction(name, payload);
        const returnValue = actualAction(payload);
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

