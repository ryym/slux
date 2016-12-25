import { createDispatcher } from 'slux';
import store from './store';

const defineCommands = (mutations, actions, to) => ({
  selectReddit: to(actions.selectReddit, 'SELECT_REDDIT'),
  fetchPosts: to(actions.fetchPosts, 'FETCH_POSTS'),
  invalidateReddit: to(actions.fetchPosts, 'INVALIDATE_POSTS'),
});
export const { dispatcher, commands } = createDispatcher(store, defineCommands);
