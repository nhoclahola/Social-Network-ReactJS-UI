import axios from "axios";
import { Dispatch } from "redux";
import { API_BASE_URL, api } from "../../config/api";
import { GET_PROFILE_FAILURE, GET_PROFILE_REQUEST, GET_PROFILE_SUCCESS, LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, REGISTER_FAILURE, REGISTER_REQUEST, REGISTER_SUCCESS, UPDATE_PROFILE_FAILURE, UPDATE_PROFILE_REQUEST, UPDATE_PROFILE_SUCCESS } from "./auth.actionType";

const login = async (loginData: any) => {
    console.log("loginData", loginData.data)
    const response = await axios.post(`${API_BASE_URL}/auth/login`, loginData.data);
    return response.data;
};

export const loginThunk = (loginData: any) => {
    return async (dispatch: Dispatch) => {
        dispatch({ type: LOGIN_REQUEST });

        try {
            const data = await login(loginData);
            localStorage.setItem("jwt", data.jwt);
            dispatch({ type: LOGIN_SUCCESS, payload: data });
        } 
        catch (error) {
            dispatch({ type: LOGIN_FAILURE, payload: error });
            console.log("error", error);
        }
    };
};

export const loginUser = (loginData: any) => async (dispatch: Dispatch) => {
    dispatch({ type: LOGIN_REQUEST });
    try {
        const { data } = await axios.post(`${API_BASE_URL}/auth/login`, loginData.data);
        if (data.jwt) {
            localStorage.setItem("jwt", data.jwt);
            console.log("login success", data);
            dispatch({ type: LOGIN_SUCCESS, payload: data.jwt });
        }

    }
    catch (error) {
        console.error("login error");
        dispatch({ type: LOGIN_FAILURE, payload: error });
    }
};

export const registerUser = (registerData: any) => async (dispatch: Dispatch) => {
    dispatch({ type: REGISTER_REQUEST });
    try {
        const { data } = await axios.post(`${API_BASE_URL}/auth/register`, registerData.data);
        if (data.jwt) {
            localStorage.setItem("jwt", data.jwt);
        }
        console.log("register", data);
        dispatch({ type: REGISTER_SUCCESS, payload: data.jwt });

    }
    catch (error) {
        console.error("error");
        dispatch({ type: REGISTER_FAILURE, payload: error });
    }
};

export const getProfileAction = (jwt: string | null) => async (dispatch: Dispatch) => {
    dispatch({ type: GET_PROFILE_REQUEST });
    try {
        const { data } = await axios.get(`${API_BASE_URL}/api/users/fromToken`, {
            headers: {
                "Authorization": `Beared ${jwt}`
            },
        });

        console.log("profile--", data);
        dispatch({ type: GET_PROFILE_SUCCESS, payload: data });

    }
    catch (error) {
        console.error(error);
        dispatch({ type: GET_PROFILE_FAILURE, payload: error });
    }
};

export const updateProfileAction = (reqData: any) => async (dispatch: Dispatch) => {
    dispatch({ type: UPDATE_PROFILE_REQUEST });
    try {
        const { data } = await axios.put(`${API_BASE_URL}/api/users/fromToken`, reqData, {
            baseURL: API_BASE_URL,
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            },
        });

        console.log("profile--", data);
        dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: data });

    }
    catch (error) {
        console.error(error);
        dispatch({ type: UPDATE_PROFILE_FAILURE, payload: error });
    }
}