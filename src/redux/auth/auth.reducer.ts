import { LoginFailureAction, LoginRequestAction, LoginSuccessAction, RegisterFailureAction, RegisterRequestAction, RegisterSuccessAction } from "./auth.actionType";

export interface AuthState {
    jwt: string | null;
    loading: boolean;
    error: string | null;
    user: string | null;
}

const initState: AuthState = {
    jwt: null,
    loading: false,
    error: null,
    user: null,
};

export type AuthActionTypes = LoginFailureAction | LoginRequestAction | LoginSuccessAction | RegisterFailureAction | RegisterRequestAction | RegisterSuccessAction;

export const authReducer = (state: any = initState, action: any) => {
    switch (action.type) {
        case "LOGIN_REQUEST":
        case "REGISTER_REQUEST":
        case "GET_PROFILE_REQUEST":
            return { ...state, loading: true, error: null };
        case "GET_PROFILE_SUCCESS":
        case "UPDATE_PROFILE_SUCCESS":
            return { ...state, user: action.payload.result, error: null, loading: false };
        case "LOGIN_SUCCESS":
        case "REGISTER_SUCCESS":
            return { ...state, jwt: action.payload.result, loading: false, error: null };
        case "LOGIN_FAILURE":
        case "REGISTER_FAILURE":
            return { ...state, loading: false, error: action.payload };
        case "UPDATE_PROFILE_FAILURE":
            return { ...state, error: action.payload?.response?.data?.message, loading: false };
        default:
            return state;
    }
};