import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { LOGIN } from "../redux/action";

export default function AppInitializer({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Loaded from storage:", localStorage.getItem("username"));
    const username = localStorage.getItem("username");
    if (token) {
      dispatch({
        type: LOGIN,
        payload: { token, username },
      });
    }
  }, [dispatch]);

  return children;
}
