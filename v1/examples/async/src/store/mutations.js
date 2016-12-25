export const changeReddit = ({ state }, nextReddit) => {
  state.selectedReddit = nextReddit;
};

export const startPostsRequest = ({ state, getters }, reddit) => {
  const posts = getters.getPosts(reddit);
  posts.isFetching = true;
  state.postsByReddit[reddit] = posts;
};

export const succeedPostsRequest = ({ state }, payload) => {
  const { reddit, posts, receivedAt } = payload;
  Object.assign(state.postsByReddit[reddit], {
    isFetching: false,
    posts,
    lastUpdated: receivedAt,
  });
};
