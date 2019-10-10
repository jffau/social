import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Post from '../components/post/Post';
import StaticProfile from '../components/profile/StaticProfile';
import Grid from '@material-ui/core/Grid';

// skeletons:
import PostSkeleton from '../util/PostSkeleton';
import ProfileSkeleton from '../util/ProfielSkeleton';

import { connect } from 'react-redux';
import { getUserData } from '../redux/actions/dataActions';

class user extends Component {
  state = {
    profile: null,
    idParam: null
  };
  componentDidMount() {
    const { handle, screamId } = this.props.match.params;

    if (screamId) this.setState({ idParam: screamId });
    this.props.getUserData(handle);
    // To get user details (bio/website etc):
    axios
      .get(
        `https://us-central1-socialape-8fb19.cloudfunctions.net/api/user/${handle}`
      )
      .then(res => {
        this.setState({
          profile: res.data.user
        });
      })
      .catch(err => console.log(err));
  }
  render() {
    const { posts, loading } = this.props.data;
    const { idParam } = this.state;

    const markUp = loading ? (
      <PostSkeleton />
    ) : posts === null ? (
      <p>No posts from this user</p>
    ) : !idParam ? (
      posts.map(post => <Post key={post.screamId} post={post} />)
    ) : (
      posts.map(post => {
        if (post.screamId !== idParam)
          return <Post key={post.screamId} post={post} />;
        else return <Post key={post.screamId} post={post} openDialog />;
      })
    );
    return (
      <Grid container spacing={8}>
        <Grid item sm={4} xs={12}>
          {this.state.profile === null ? (
            <ProfileSkeleton />
          ) : (
            <StaticProfile profile={this.state.profile} />
          )}
        </Grid>
        <Grid item sm={8} xs={12}>
          {markUp}
        </Grid>
      </Grid>
    );
  }
}

user.propTypes = {
  getUserData: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  data: state.data
});

export default connect(
  mapStateToProps,
  { getUserData }
)(user);
