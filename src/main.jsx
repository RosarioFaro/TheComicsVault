import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import store from "./redux/store";
import AppInitializer from "./utils/AppInitalizer.js";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <AppInitializer>
      <App />
    </AppInitializer>
  </Provider>
);
