import { mutation, action } from 'slux';
import fetchRedditPosts from '../lib/fetchRedditPosts';
import { getOrInitPosts } from './getters'


export const startPostsRequest = mutation(
  'Start Posts Request',
  (state, reddit) => {
    const { postsByReddit } = state
    const posts = getOrInitPosts(state, reddit)
    posts.isFetching = true
    state.postsByReddit[reddit] = posts
    return state;
  }
);

export const succeedPostsRequest = mutation(
  'Succeed Posts Request',
  (state, { reddit, posts, receivedAt }) => {
    Object.assign(state.postsByReddit[reddit], {
      isFetching: false,
      posts,
      lastUpdated: receivedAt,
    })
    return state;
  }
);

export const fetchPosts = action(
  'Fetch Posts',
  ({ commit }, state, reddit) => {
    commit(startPostsRequest, reddit);
    fetchRedditPosts(reddit).then(posts => {
      commit(succeedPostsRequest, {
        reddit,
        posts,
        receivedAt: Date.now(),
      });
    });
  }
);

export const initializePosts = action(
  'Initialize Posts',
  ({ commit, run }, state) => {
    run(fetchPosts, state.selectedReddit);
  }
);
