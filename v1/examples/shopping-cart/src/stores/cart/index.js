import { Store } from 'slux';
import * as getters from './getters';
import * as mutations from './mutations';
import * as actions from './actions';

const getInitialState = () => ({
  addedIds: [],
  quantityById: {},
});

export default new Store({
  name: 'CartStore',
  getters,
  mutations,
  actions,
  getInitialState,
});
