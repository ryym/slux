import { getter } from './';
import { _STORE_REF_ACCESS_KEY } from './StoreRef';

const getState = getter(state => state);

const getInitialState = getter((_, { stores: { _self } }) => {
  return _self.getStore(_STORE_REF_ACCESS_KEY).getInitialState();
});

module.exports = {
  getState,
  getInitialState,
};
