import React, { Component } from 'react';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
export class Home extends Component {
  state = {
    posts: null
  };

  componentDidMount() {
    axios
      .get('/screams')
      .then(res => {
        this.setState({
          posts: res.data
        });
      })
      .catch(err => {
        console.error(err);
      });
  }

  render() {
    let recentPostsMarkup = this.state.posts ? (
      this.state.posts.map(post => <p> {post.body}</p>)
    ) : (
      <p>Loading...</p>
    );
    return (
      <Grid container spacing={8}>
        <Grid item sm={8} xs={12}>
          {recentPostsMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          <p>Profile</p>
        </Grid>
      </Grid>
    );
  }
}

export default Home;