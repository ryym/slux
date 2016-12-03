/**
 * Fetch posts from reddit.
 */
export const fetchPosts = (fetchRedditPosts) => ({ mutations }, reddit) => {
  mutations.startPostsRequest(reddit);
  fetchRedditPosts(reddit).then(posts => {
    mutations.succeedPostsRequest({
      reddit,
      posts,
      receivedAt: Date.now(),
    });
  });
};

/**
 * Change the selected reddit end fetch its posts if necessary.
 */
export const selectReddit = ({ getters, mutations, actions }, reddit) => {
  const prevReddit = getters.getSelectedReddit();
  mutations.changeReddit(reddit);
  if (reddit !== prevReddit && !getters.hasPosts(reddit)) {
    actions.fetchPosts(reddit);
  }
};
