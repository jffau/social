import {
  SET_POSTS,
  LIKE_POST,
  UNLIKE_POST,
  DELETE_POST,
  LOADING_DATA,
  CREATE_POST,
  SET_POST,
  SUBMIT_COMMENT
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
      if (state.post.screamId === action.payload.screamId) {
        // saving comments into a temp variables to prevent post to be overwritten by the payload
        let tempComments = state.post.comments;
        state.post = action.payload;
        state.post.comments = tempComments;
      }
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
    case CREATE_POST: {
      return {
        ...state,
        posts: [action.payload, ...state.posts]
      };
    }
    case SUBMIT_COMMENT:
      return {
        ...state,
        posts: {
          ...state.posts,
          comments: [action.payload, ...state.posts.comments]
        }
      };
    case SET_POST:
      return {
        ...state,
        post: action.payload
      };
    default:
      return state;
  }
}
