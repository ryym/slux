import { Store } from 'slux';

const mutations = {
  increment: ({ state }) => state + 1,
  decrement: ({ state }) => state - 1,
  incrementIfOdd: ({ state }) => (state % 2 === 0) ? state : state + 1,
};

const actions = {
  incrementAsync: ({ mutations }) => {
    setTimeout(mutations.increment, 1000);
  },
};

export default new Store({
  name: 'CounterStore',
  actions,
  mutations,
  getInitialState: () => 0,
});

