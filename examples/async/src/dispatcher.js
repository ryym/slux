import { createDispatcher } from 'slux';
import store from './store';

const dispatcher = createDispatcher(store, (mutations, actions) => ({
  SELECT_REDDIT: actions.selectReddit,
  FETCH_POSTS: actions.fetchPosts,
  INVALIDATE_REDDIT: actions.fetchPosts,
}));

export const commands = dispatcher.getCommands();
export default dispatcher;
