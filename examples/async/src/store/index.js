import { Store } from 'slux';
import fetchRedditPosts from '../api/fetchRedditPosts';
import * as getters from './getters';
import * as mutations from './mutations';
import { fetchPosts, selectReddit } from './actions';

const getInitialState = () => ({
  selectedReddit: 'reactjs',
  postsByReddit: {},
});

const takeSnapshot = (state) => {
  const { selectedReddit, postsByReddit } = state;
  const postsClone = Object.keys(postsByReddit).reduce((pbr, reddit) => {
    pbr[reddit] = Object.assign({}, postsByReddit[reddit]);
    return pbr;
  }, {});
  return {
    selectedReddit,
    postsByReddit: postsClone,
  };
};

export default new Store({
  name: 'AsyncStore',
  getters,
  mutations,
  actions: {
    fetchPosts: fetchPosts(fetchRedditPosts),
    selectReddit,
  },
  getInitialState,
  takeSnapshot,
});
