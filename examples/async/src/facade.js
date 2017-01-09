import { createFacade } from 'slux';
import store from './store';
import {
  getSelectedReddit,
  selectReddit,
} from './store/reddit';
import {
  getPosts,
  fetchPosts,
  initializePosts,
} from './store/posts';

export default createFacade(store, ({ query, run }) => ({
  getSelectedReddit: query(getSelectedReddit),
  selectReddit: run(selectReddit),

  getPosts: query(getPosts),
  fetchPosts: run(fetchPosts),
  initializePosts: run(initializePosts),
}));
