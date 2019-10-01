import { SET_POSTS, LOADING_DATA, LIKE_POST, UNLIKE_POST } from '../types';
import axios from 'axios';

// GET ALL POSTS:
export const getPosts = () => dispatch => {
  dispatch({ type: LOADING_DATA });
  axios
    .get('https://us-central1-socialape-8fb19.cloudfunctions.net/api/screams')
    .then(res => {
      dispatch({
        type: SET_POSTS,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: SET_POSTS,
        payload: []
      });
    });
};

export const likePost = screamId => dispatch => {
  axios
    .get(
      `https://us-central1-socialape-8fb19.cloudfunctions.net/api/screams/${screamId}/like`
    )
    .then(res => {
      dispatch({
        type: LIKE_POST,
        payload: res.data
      });
    })
    .catch(err => console.log(err));
};

export const unlikePost = screamId => dispatch => {
  axios
    .get(
      `https://us-central1-socialape-8fb19.cloudfunctions.net/api/screams/${screamId}/unlike`
    )
    .then(res => {
      dispatch({
        type: UNLIKE_POST,
        payload: res.data
      });
    })
    .catch(err => console.log(err));
};
