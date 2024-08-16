import SockJS from "sockjs-client";
import { API_BASE_URL } from "../../config/api";
import Stomp from "stompjs";
import { Dispatch } from "redux";
import { SET_STOMP_CLIENT_FAILURE, SET_STOMP_CLIENT_REQUEST, SET_STOMP_CLIENT_SUCCESS } from "./webSocket.actionType";

const setStompClient = () => {
  return new Promise((resolve, reject) => {
    const sock = new SockJS(API_BASE_URL + "/ws");
    const client = Stomp.over(sock);
    
    client.connect({}, () => {
      console.log('Connected');
      resolve(client); // Trả về client đã kết nối
    }, (error) => {
      console.error('Connection error:', error);
      reject(error); // Xử lý lỗi nếu kết nối thất bại
    });
  });
};

export const setStompClientThunk = () => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: SET_STOMP_CLIENT_REQUEST });

    try {
      const data = await setStompClient();
      dispatch({ type: SET_STOMP_CLIENT_SUCCESS, payload: data });
    }
    catch (error) {
      dispatch({ type: SET_STOMP_CLIENT_FAILURE, payload: error });
      console.log("error", error);
    }
  };
};