export const getPosts = (state, reddit) =>
  state.postsByReddit[reddit]

export const getOrInitPosts = (state, reddit) => {
  return getPosts(state, reddit) || {
    isFetching: false,
    posts: [],
  }
}

export const hasPosts = (state, reddit) =>
  state.postsByReddit.hasOwnProperty(reddit)
