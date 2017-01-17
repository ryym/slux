import { mutation, effect } from 'slux';
import { fetchPosts } from './posts';
import { hasPosts } from './getters';

export const changeReddit = mutation(
  'Change Reddit',
  (state, nextReddit) => {
    state.selectedReddit = nextReddit;
    return state;
  }
);

export const selectReddit = effect(
  'Select Reddit',
  ({ commit, run }, state, reddit) => {
    const prevReddit = state.selectedReddit;
    commit(changeReddit, reddit);
    if (reddit !== prevReddit && !hasPosts(state, reddit)) {
      run(fetchPosts, reddit);
    }
  }
);
