import { createStore } from 'slux';
import cloneDeep from 'lodash.clonedeep';

const getInitialState = () => ({
  selectedReddit: 'reactjs',
  postsByReddit: {},
});

export default createStore('AsyncStore', {
  getInitialState,
  takeSnapshot: cloneDeep,
});
