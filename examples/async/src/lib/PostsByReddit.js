import cloneDeep from 'lodash.clonedeep';

// XXX: Unused

export default class PostsByReddit {
  constructor() {
    this._posts = {}
  }

  getPosts(reddit) {
    return this._posts[reddit]
  }

  getOrInitPosts(reddit) {
    return this.getPosts(reddit) || {
      isFetching: false,
      posts: [],
    }
  }

  hasPosts(reddit) {
    return this._posts.hasOwnProperty(reddit)
  }

  setPosts(reddit, posts) {
    this._posts[reddit] = posts
  }

  updatePosts(reddit, posts) {
    const currentPosts = this.getPosts(reddit)
    const newPosts = Object.assign({}, currentPosts, posts);
    this.setPosts(reddit, newPosts)
  }

  toObject() {
    return cloneDeep(this._posts)
  }
}
