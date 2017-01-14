import { getter, mutation, action } from 'slux';
import { hasPosts, fetchPosts } from './posts';

export const getSelectedReddit = getter(
  state => state.selectedReddit
);

export const changeReddit = mutation(
  'Change Reddit',
  (state, _, nextReddit) => {
    state.selectedReddit = nextReddit;
    return state;
  }
);

export const selectReddit = action(
  'Select Reddit',
  ({ query, commit, run }, reddit) => {
    const prevReddit = query(getSelectedReddit);
    commit(changeReddit, reddit);
    if (reddit !== prevReddit && !query(hasPosts, reddit)) {
      run(fetchPosts, reddit);
    }
  }
);
