import { UPLOAD_FAILURE, UPLOAD_REQUEST, UPLOAD_SUCCESS } from "./post.actionType";

interface UploadState {
  loading: boolean;
  data: any | null;
  error: any | null;
}

const initialState: UploadState = {
  loading: false,
  data: null,
  error: null
};

export const postUploadReducer = (state = initialState, action: any): UploadState => {
  switch (action.type) {
    case UPLOAD_REQUEST:
      return { ...state, loading: true, error: null};
    case UPLOAD_SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case UPLOAD_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};