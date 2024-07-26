export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";

export const REGISTER_REQUEST = "REGISTER_REQUEST";
export const REGISTER_SUCCESS = "REGISTER_SUCCESS";
export const REGISTER_FAILURE = "REGISTER_FAILURE";

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