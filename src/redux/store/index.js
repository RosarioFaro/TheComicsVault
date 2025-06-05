import { combineReducers, configureStore } from "@reduxjs/toolkit";
import loginReducer from "../reducer/loginReducer";
import { volumiReducer } from "../reducer/volumiReducer";
import { volumeReducer } from "../reducer/volumeReducer";

const mainReducer = combineReducers({
  login: loginReducer,
  volumi: volumiReducer,
  volume: volumeReducer,
});

const store = configureStore({
  reducer: mainReducer,
});

export default store;
