import {
  SET_POSTS,
  LIKE_POST,
  UNLIKE_POST,
  DELETE_POST,
  LOADING_DATA
} from '../types';

const initialState = {
  posts: [],
  post: {},
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true
      };
    case SET_POSTS:
      return {
        ...state,
        posts: action.payload,
        loading: false
      };
    //   Doing the same thing for both cases:
    case LIKE_POST:
    case UNLIKE_POST: {
      let index = state.posts.findIndex(
        scream => scream.screamId === action.payload.screamId
      );
      state.posts[index] = action.payload;
      return {
        ...state
      };
    }
    case DELETE_POST: {
      let index = state.posts.findIndex(
        post => post.screamId === action.payload
      );
      state.posts.splice(index, 1);
      return {
        ...state
      };
    }
    default:
      return state;
  }
}
