import React, { Component, PropTypes } from 'react';
import connect from '../connect';
import Picker from '../components/Picker';
import Posts from '../components/Posts';

class App extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleRefreshClick = this.handleRefreshClick.bind(this);
  }

  handleChange(nextReddit) {
    this.props.selectReddit(nextReddit);
  }

  handleRefreshClick(event) {
    event.preventDefault();
    const { fetchPosts, selectedReddit } = this.props;
    fetchPosts(selectedReddit);
  }

  render() {
    const { selectedReddit, posts, isFetching, lastUpdated } = this.props;
    return (
      <div>
        <Picker value={selectedReddit}
          onChange={this.handleChange}
          options={['reactjs', 'frontend']}
        />
        <p>
          {lastUpdated &&
            <span>
              Last updated at {new Date(lastUpdated).toLocaleTimeString()}.
              {' '}
            </span>
          }
          {!isFetching &&
            <a href="#" onClick={this.handleRefreshClick}>
              Refresh
            </a>
          }

        </p>
        {isFetching && posts.length === 0 &&
          <h2>Loading...</h2>
        }
        {!isFetching && posts.length === 0 &&
          <h2>Empty.</h2>
        }
        {posts.length > 0 &&
          <div style={{ opacity: isFetching ? 0.5 : 1 }}>
            <Posts posts={posts} />
          </div>
        }
      </div>
    );
  }
}

App.propTypes = {
  selectedReddit: PropTypes.string.isRequired,
  posts: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.number,
  selectReddit: PropTypes.func.isRequired,
  fetchPosts: PropTypes.func.isRequired,
};

const mapToProps = methods => {
  const selectedReddit = methods.getSelectedReddit();
  const {
    posts,
    isFetching,
    lastUpdated,
  } = methods.getPosts(selectedReddit);
  return {
    selectedReddit,
    posts,
    isFetching,
    lastUpdated,
    selectReddit: methods.selectReddit,
    fetchPosts: methods.fetchPosts,
  };
};

export default connect(mapToProps)(App);
