import { UPLOAD_REQUEST, UPLOAD_SUCCESS, UPLOAD_FAILURE, GET_HOMEPAGE_POSTS_REQUEST, LIKE_POST_REQUEST, GET_USERS_POSTS_REQUEST, GET_HOMEPAGE_POSTS_SUCCESS, LIKE_POST_SUCCESS, GET_USERS_POSTS_SUCCESS, GET_HOMEPAGE_POSTS_FAILURE, LIKE_POST_FAILURE, GET_USERS_POSTS_FAILURE } from './post.actionType'

interface PostState {
    loading: boolean;
    data: any | null;
    error: any | null;
}

const initialState: PostState = {
    loading: false,
    data: null,
    error: null
};

export const postReducer = (state = initialState, action: any): PostState => {
    switch (action.type) {
        case GET_HOMEPAGE_POSTS_REQUEST:
        case LIKE_POST_REQUEST:
        case GET_USERS_POSTS_REQUEST:
            return { ...state, loading: true };
        case GET_HOMEPAGE_POSTS_SUCCESS:
        case LIKE_POST_SUCCESS:
        case GET_USERS_POSTS_SUCCESS:
            return { ...state, loading: false, data: action.payload };
        case GET_HOMEPAGE_POSTS_FAILURE:
        case LIKE_POST_FAILURE:
        case GET_USERS_POSTS_FAILURE:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};
