import { getter } from './';
import { _SEALED_STORE_ACCESS_KEY } from './SealedStore';

const getState = getter(state => state);

const getInitialState = getter((_, { stores: { _self } }) => {
  return _self.getStore(_SEALED_STORE_ACCESS_KEY).getInitialState();
});

module.exports = {
  getState,
  getInitialState,
};
