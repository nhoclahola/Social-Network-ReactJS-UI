export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";

export const REGISTER_REQUEST = "REGISTER_REQUEST";
export const REGISTER_SUCCESS = "REGISTER_SUCCESS";
export const REGISTER_FAILURE = "REGISTER_FAILURE";

export const GET_PROFILE_REQUEST = "GET_PROFILE_REQUEST";
export const GET_PROFILE_SUCCESS = "GET_PROFILE_SUCCESS";
export const GET_PROFILE_FAILURE = "GET_PROFILE_FAILURE";

export const UPDATE_PROFILE_REQUEST = "UPDATE_PROFILE_REQUEST";
export const UPDATE_PROFILE_SUCCESS = "UPDATE_PROFILE_SUCCESS";
export const UPDATE_PROFILE_FAILURE = "UPDATE_PROFILE_FAILURE";

export const UPLOAD_AVATAR_REQUEST = "UPLOAD_AVATAR_REQUEST";
export const UPLOAD_AVATAR_SUCCESS = "UPLOAD_AVATAR_SUCCESS";
export const UPLOAD_AVATAR_FAILURE = "UPLOAD_AVATAR_FAILURE";

export interface UserData {
    id: string;
    username: string;
}

export interface LoginRequestAction {
    type: typeof LOGIN_REQUEST;
}

export interface LoginSuccessAction {
    type: typeof LOGIN_SUCCESS;
    payload: string;
}

export interface LoginFailureAction {
    type: typeof LOGIN_FAILURE;
    payload: string;
}

export interface RegisterRequestAction {
    type: typeof REGISTER_REQUEST;
}

export interface RegisterSuccessAction {
    type: typeof REGISTER_SUCCESS;
    payload: string;
}

export interface RegisterFailureAction {
    type: typeof REGISTER_FAILURE;
    payload: string;
}