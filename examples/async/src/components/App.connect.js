import React, { Component, PropTypes } from 'react';
import { connect } from 'slux/react';
import { commands } from '../dispatcher';
import { getSelectedReddit } from '../store/reddit';
import { getPosts } from '../store/posts';
import Picker from '../components/Picker';
import Posts from '../components/Posts';

class App extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleRefreshClick = this.handleRefreshClick.bind(this);
  }

  handleChange(nextReddit) {
    this.props.dispatch(commands.selectReddit, nextReddit);
  }

  handleRefreshClick(event) {
    event.preventDefault();
    const { dispatch, selectedReddit } = this.props;
    dispatch(commands.fetchPosts, selectedReddit);
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
  dispatch: PropTypes.func.isRequired,
};

function mapStateToProps(query) {
  const selectedReddit = query(getSelectedReddit);
  const {
    posts,
    isFetching,
    lastUpdated,
  } = query(getPosts, selectedReddit);

  return {
    selectedReddit,
    posts,
    isFetching,
    lastUpdated,
  };
}

export default connect(mapStateToProps)(App);
