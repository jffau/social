import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';

import Post from '../components/post/Post';
import Profile from '../components/profile/Profile';

// redux
import { connect } from 'react-redux';
import { getPosts } from '../redux/actions/dataActions';
export class Home extends Component {
  state = {
    posts: null
  };

  componentDidMount() {
    this.props.getPosts();
  }

  render() {
    const { posts, loading } = this.props.data;
    let recentPostsMarkup = !loading ? (
      posts.map(post => <Post key={post.screamId} post={post} />)
    ) : (
      <p>Loading...</p>
    );
    return (
      <Grid container spacing={8}>
        <Grid item sm={8} xs={12}>
          {recentPostsMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          <Profile />
        </Grid>
      </Grid>
    );
  }
}

Home.propTypes = {
  getPosts: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  // from data reducer
  data: state.data
});

export default connect(
  mapStateToProps,
  { getPosts }
)(Home);
