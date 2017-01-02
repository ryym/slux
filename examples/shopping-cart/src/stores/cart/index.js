import { createStore } from 'slux';

const getInitialState = () => ({
  addedIds: [],
  quantityById: {},
});

const takeSnapshot = state => ({
  addedIds: state.addedIds.slice(0),
  quantityById: { ...state.quantityById },
});

export default createStore({
  name: 'CartStore',
  getInitialState,
  takeSnapshot,
});
