import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { thunk } from "redux-thunk";
import { AuthState, authReducer } from "./auth/auth.reducer";
import { postReducer } from "./post/post.reducer";
import { postUploadReducer } from "./post/postUpload.reducer";


const rootReducers = combineReducers({
    auth: authReducer,
    post: postReducer,
    upload: postUploadReducer,
});

export const store = legacy_createStore(rootReducers, applyMiddleware(thunk));

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch