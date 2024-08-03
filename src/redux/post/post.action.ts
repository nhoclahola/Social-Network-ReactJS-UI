import { Dispatch } from 'redux';
import axios from 'axios';
import { UPLOAD_REQUEST, UPLOAD_SUCCESS, UPLOAD_FAILURE, GET_HOMEPAGE_POSTS_REQUEST, GET_HOMEPAGE_POSTS_SUCCESS, GET_HOMEPAGE_POSTS_FAILURE, LIKE_POST_REQUEST, LIKE_POST_SUCCESS, LIKE_POST_FAILURE, GET_USERS_POSTS_REQUEST, GET_USERS_POSTS_SUCCESS, GET_USERS_POSTS_FAILURE } from './post.actionType';
import { API_BASE_URL, api } from "../../config/api";

const uploadPost = async (caption: string, image: File | null, video: File | null) => {
	const formData = new FormData();
	formData.append('caption', caption);
	// If either image or video is null, append an empty file to prevent error
	const emptyFile = new File([], '');
	formData.append('image', image || emptyFile);
	formData.append('video', video || emptyFile);
	const response = await axios.post(`${API_BASE_URL}/api/posts`, formData, {
		headers: {
			"Authorization": `Bearer ${localStorage.getItem("jwt")}`,
			"Content-Type": "multipart/form-data"
		}
	});

	return response.data;
};

const getHomePagePost = async (followingIndex: number, randomIndex: number) => {
	const response = await axios.get(`/api/posts/homepage?followingIndex=${followingIndex}&randomIndex=${randomIndex}`, {
		baseURL: API_BASE_URL,
		headers: {
			"Authorization": `Bearer ${localStorage.getItem("jwt")}`
		},
	});
	return response.data;
};

const likePost = async (postId: string) => {
	const response = await api.post(`/api/posts/${postId}/like`, {
		baseURL: API_BASE_URL,
		headers: {
			"Authorization": `Bearer ${localStorage.getItem("jwt")}`
		},
	});
	return response.data;
};

const getUsersPost = async (userId: string) => {
	const response = await api.get(`/api/posts/user/${userId}`, {
		baseURL: API_BASE_URL,
		headers: {
			"Authorization": `Bearer ${localStorage.getItem("jwt")}`
		},
	});
	return response.data;
};

// Thunk action to call api
export const uploadPostThunk = (caption: string, image: File | null, video: File | null) => {
	return async (dispatch: Dispatch) => {
		dispatch({ type: UPLOAD_REQUEST });

		try {
			const data = await uploadPost(caption, image, video);
			dispatch({ type: UPLOAD_SUCCESS, payload: data });
		}
		catch (error) {
			dispatch({ type: UPLOAD_FAILURE, payload: error });
			console.log("error", error);
		}
	};
};

export const getHomePagePostThunk = (followingIndex: number, randomIndex: number) => {
	return async (dispatch: Dispatch) => {
		dispatch({ type: GET_HOMEPAGE_POSTS_REQUEST });

		try {
			const data = await getHomePagePost(followingIndex, randomIndex);
			dispatch({ type: GET_HOMEPAGE_POSTS_SUCCESS, payload: data });
			console.log("data", data);
		}
		catch (error) {
			dispatch({ type: GET_HOMEPAGE_POSTS_FAILURE, payload: error });
			console.log("error", error);
		}
	};
};

export const likePostThunk = (postId: string) => {
	return async (dispatch: Dispatch) => {
		dispatch({ type: LIKE_POST_REQUEST });

		try {
			const data = await likePost(postId);
			dispatch({ type: LIKE_POST_SUCCESS, payload: data });
		}
		catch (error) {
			dispatch({ type: LIKE_POST_FAILURE, payload: error });
			console.log("error", error);
		}
	};
};

export const getUsersPostThunk = (userId: string) => {
	return async (dispatch: Dispatch) => {
		dispatch({ type: GET_USERS_POSTS_REQUEST });

		try {
			const data = await getUsersPost(userId);
			dispatch({ type: GET_USERS_POSTS_SUCCESS, payload: data });
		}
		catch (error) {
			dispatch({ type: GET_USERS_POSTS_FAILURE, payload: error });
			console.log("error", error);
		}
	};
};