import { GET_VOLUME } from "../action";

const initialState = {
  volume: null,
};

export const volumeReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_VOLUME:
      return { ...state, volume: action.payload };
    default:
      return state;
  }
};
