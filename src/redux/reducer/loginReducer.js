import { LOGIN } from "../action";

const initialState = {
  token: "",
  username: "",
  avatar: "",
};

const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        token: action.payload.token,
        username: action.payload.username,
        avatar: action.payload.avatar,
      };
    default:
      return state;
  }
};

export default loginReducer;
