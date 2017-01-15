import { mutation, action } from 'slux';
import { fetchPosts } from './posts';
import { hasPosts } from './getters'

export const changeReddit = mutation(
  'Change Reddit',
  (state, nextReddit) => {
    state.selectedReddit = nextReddit;
    return state;
  }
);

export const selectReddit = action(
  'Select Reddit',
  ({ commit, run }, state, reddit) => {
    const prevReddit = state.selectedReddit;
    commit(changeReddit, reddit);
    if (reddit !== prevReddit && !hasPosts(state, reddit)) {
      run(fetchPosts, reddit);
    }
  }
);
