export const getSelectedReddit = ({ state }) =>
  state.selectedReddit;

export const hasPosts = ({ state }, reddit) =>
  Boolean(state.postsByReddit[reddit]);

export const getPosts = ({ state, getters }, reddit) => {
  if (getters.hasPosts(reddit)) {
    return state.postsByReddit[reddit];
  }
  return {
    isFetching: false,
    posts: [],
  };
};
