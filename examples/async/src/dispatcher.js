import { createDispatcher } from 'slux';
import store from './store';
import { selectReddit } from './store/reddit';
import { fetchPosts } from './store/posts';

const defineCommands = (commit, run) => ({
  selectReddit: run(selectReddit),
  fetchPosts: run(fetchPosts),
});
export const { dispatcher, commands } = createDispatcher(store, defineCommands);
