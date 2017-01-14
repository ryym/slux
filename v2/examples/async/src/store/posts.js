import { getter, mutation, action } from 'slux';
import fetchRedditPosts from '../api/fetchRedditPosts';
import { getSelectedReddit } from './reddit';

export const getPosts = getter(
  (state, { query }, reddit) => {
    if (query(hasPosts, reddit)) {
      return state.postsByReddit[reddit];
    }
    return {
      isFetching: false,
      posts: [],
    };
  }
);

export const hasPosts = getter(
  (state, _, reddit) => state.postsByReddit.hasOwnProperty(reddit)
);

export const startPostsRequest = mutation(
  'Start Posts Request',
  (state, { query }, reddit) => {
    const posts = query(getPosts, reddit);
    posts.isFetching = true;
    state.postsByReddit[reddit] = posts;
    return state;
  }
);

export const succeedPostsRequest = mutation(
  'Succeed Posts Request',
  (state, _, { reddit, posts, receivedAt }) => {
    Object.assign(state.postsByReddit[reddit], {
      isFetching: false,
      posts,
      lastUpdated: receivedAt,
    });
    return state;
  }
);

export const fetchPosts = action(
  'Fetch Posts',
  ({ commit }, reddit) => {
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
  ({ query, run }) => {
    const reddit = query(getSelectedReddit);
    run(fetchPosts, reddit);
  }
);
