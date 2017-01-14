import { createStore } from 'slux';

const getInitialState = () => ({
  byId: {},
  visibleIds: [],
});

const takeSnapshot = state => ({
  byId: { ...state.byId },
  visibleIds: state.visibleIds.slice(0),
});

export default createStore({
  name: 'ProductsStore',
  getInitialState,
  takeSnapshot,
});
