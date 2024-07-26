import { LoginFailureAction, LoginRequestAction, LoginSuccessAction, RegisterFailureAction, RegisterRequestAction, RegisterSuccessAction } from "./auth.actionType";

export interface AuthState {
    jwt: string | null;
    loading: boolean;
    error: string | null;
}

const initState: AuthState = {
    jwt: null,
    loading: false,
    error: null,
};

export type AuthActionTypes = LoginFailureAction | LoginRequestAction | LoginSuccessAction | RegisterFailureAction | RegisterRequestAction | RegisterSuccessAction;

export const authReducer = (state: any = initState, action: any) => {
    switch (action.type) {
        case "LOGIN_REQUEST":
        case "REGISTER_REQUEST":
            return {...state, loading: true, error: null};
        case "LOGIN_SUCCESS":
        case "REGISTER_SUCCESS":
            return {...state, jwt: action.payload, loading: false, error: null};
        case "LOGIN_FAILURE":
        case "REGISTER_FAILURE":
            return {...state, loading: false, error: action.payload};
        default:
            return state;
    }
};