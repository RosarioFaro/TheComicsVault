import axios from "axios";

export const LOGIN = "LOGIN";
export const GET_VOLUMI = "GET_VOLUMI";
export const GET_VOLUME = "GET_VOLUME";
export const SET_RECOMMENDED_VOLUMI = "SET_RECOMMENDED_VOLUMI";

export const login = (credentials) => async (dispatch) => {
  try {
    const res = await axios.post("/api/auth/login", credentials);
    const { token } = res.data;

    const payload = parseJwt(token);
    const username = payload.sub;

    const userRes = await axios.get(`/api/users/${username}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const { avatar } = userRes.data;

    dispatch({
      type: LOGIN,
      payload: { token, username, avatar },
    });

    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("avatar", avatar);

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false };
  }
};

export const register = (credentials) => async () => {
  try {
    const res = await axios.post("/api/auth/register", credentials);
    console.log("REGISTER RESPONSE:", res.data);
    return { success: true };
  } catch (error) {
    console.error("Register error:", error);
    return { success: false };
  }
};

function parseJwt(token) {
  if (!token) return {};
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    console.log(e);
    return {};
  }
}

export const logout = () => (dispatch) => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("avatar");
  dispatch({ type: LOGIN, payload: { token: "", username: "", avatar: "" } });
};

export const fetchVolumi = (page = 0, size = 30, query = "", sort = "startYear,desc", publisher = "") => {
  return async (dispatch) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const token = localStorage.getItem("token");
      let url = `/api/volumes?page=${page}&size=${size}`;

      if (query && query.length > 2) {
        url += `&search=${encodeURIComponent(query)}`;
      }

      if (sort) {
        url += `&sort=${encodeURIComponent(sort)}`;
      }

      if (publisher) url += `&publisher=${publisher}`;

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch({
        type: GET_VOLUMI,
        payload: res.data,
      });
    } catch (error) {
      console.error("Errore nel recupero dei volumi:", error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };
};

export const fetchVolumeDetails = (id) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/api/volumes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch({
        type: GET_VOLUME,
        payload: res.data,
      });
    } catch (error) {
      console.error("Errore nel caricamento del volume:", error);
    }
  };
};

export const fetchRecommendedVolumes = (ids) => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("/api/volumes/recommended", {
      params: { ids },
      headers: { Authorization: `Bearer ${token}` },
      paramsSerializer: (params) => params.ids.map((id) => `ids=${id}`).join("&"),
    });
    dispatch({ type: "SET_RECOMMENDED_VOLUMI", payload: res.data });
  } catch (error) {
    console.error("Errore nel fetch dei volumi raccomandati:", error);
  }
};
