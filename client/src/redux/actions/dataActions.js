import {
  SET_POSTS,
  LOADING_DATA,
  LIKE_POST,
  UNLIKE_POST,
  DELETE_POST,
  CREATE_POST,
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_POST,
  STOP_LOADING_UI
} from '../types';
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
export const getPost = screamId => dispatch => {
  dispatch({ type: LOADING_UI });
  axios
    .get(
      `https://us-central1-socialape-8fb19.cloudfunctions.net/api/screams/${screamId}`
    )
    .then(res => {
      dispatch({
        type: SET_POST,
        payload: res.data
      });
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch(err => console.log(err));
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

export const deletePost = screamId => dispatch => {
  axios
    .delete(
      `https://us-central1-socialape-8fb19.cloudfunctions.net/api/screams/${screamId}/`
    )
    .then(() => {
      dispatch({ type: DELETE_POST, payload: screamId });
    })
    .catch(err => console.log(err));
};

export const createPost = newPost => dispatch => {
  dispatch({ type: LOADING_UI });
  axios
    .post(
      'https://us-central1-socialape-8fb19.cloudfunctions.net/api/screams/',
      newPost
    )
    .then(res => {
      dispatch({
        type: CREATE_POST,
        payload: res.data
      });
      dispatch({ type: CLEAR_ERRORS });
    })
    .catch(err => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
    });
};
export const clearErrors = () => dispatch => {
  dispatch({ type: CLEAR_ERRORS });
};
