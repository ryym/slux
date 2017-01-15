import { createDispatcherWithCommands } from 'slux'
import store from './store'
import { selectReddit } from './store/reddit'
import { fetchPosts, initializePosts } from './store/posts'

export const { dispatcher, commands } = createDispatcherWithCommands(store, to => ({
  selectReddit: to(selectReddit),
  fetchPosts: to(fetchPosts),
  initializePosts: to(initializePosts),
}))
