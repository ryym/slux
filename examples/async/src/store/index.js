import { createStore } from 'slux';
import cloneDeep from 'lodash.clonedeep';

const getInitialState = () => ({
  selectedReddit: 'reactjs',
  postsByReddit: {},
});

const takeSnapshot = cloneDeep;

export default createStore({
  name: 'AsyncStore',
  getInitialState,
  takeSnapshot,
});
