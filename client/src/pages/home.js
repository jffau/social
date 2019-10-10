import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';

import Post from '../components/post/Post';
import Profile from '../components/profile/Profile';
import withStyles from '@material-ui/core/styles/withStyles';

// redux
import { connect } from 'react-redux';
import { getPosts } from '../redux/actions/dataActions';
import PostSkeleton from '../util/PostSkeleton';

const styles = theme => ({
  ...theme.options,
  container: {
    direction: 'column-reverse'
  }
});
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
      <PostSkeleton />
    );
    return (
      <Grid container spacing={8} className="classes.container">
        <Grid item sm={4} xs={12}>
          <Profile />
        </Grid>
        <Grid item sm={8} xs={12}>
          {recentPostsMarkup}
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
)(withStyles(styles)(Home));
