import { SET_STOMP_CLIENT_FAILURE, SET_STOMP_CLIENT_REQUEST, SET_STOMP_CLIENT_SUCCESS } from "./webSocket.actionType";
import Stomp from "stompjs";

interface WebSocketState {
  loading: boolean;
  data: Stomp.Client | null;
  error: any | null;
}

const initialState: WebSocketState = {
  loading: false,
  data: null,
  error: null
};

export const webSocketReducer = (state = initialState, action: any): WebSocketState => {
  switch (action.type) {
    case SET_STOMP_CLIENT_REQUEST:
      return { ...state, loading: true };
    case SET_STOMP_CLIENT_SUCCESS:
      console.log(action.payload);
      return { ...state, loading: false, data: action.payload };
    case SET_STOMP_CLIENT_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}