import { createStore, mutation, action } from 'slux';

export const increment = mutation(
  'Increment',
  state => state + 1
);

export const decrement = mutation(
  'Decrement',
  state => state - 1
);

export const incrementIfOdd = mutation(
  'Increment If Odd',
  state => (state % 2 === 0) ? state : state + 1
);

export const incrementAsync = action(
  'Increment Async',
  ({ commit }, delay) => setTimeout(() => commit(increment), delay)
);

export default createStore({
  name: 'CounterStore',
  getInitialState: () => 0,
});
