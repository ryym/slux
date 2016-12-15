import { Store } from 'slux';
import * as getters from './getters';
import * as mutations from './mutations';
import * as actions from './actions';

const getInitialState = () => ({
  byId: {},
  visibleIds: [],
});

export default new Store({
  name: 'ProductsStore',
  getters,
  mutations,
  actions,
  getInitialState,
});
