import { GET_VOLUMI } from "../action";

const initialState = {
  content: [],
  totalPages: 0,
  page: 0,
  loading: false,
};

export const volumiReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case GET_VOLUMI:
      return {
        ...state,
        content: action.payload.content,
        totalPages: action.payload.totalPages,
        page: action.payload.number,
        loading: false,
      };
    default:
      return state;
  }
};
