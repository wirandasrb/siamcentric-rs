import { apiWithAuth, apiWithoutAuth } from "./apiConfig";

const login = async (username, password) => {
  try {
    const response = await apiWithoutAuth.post("/auth/login", {
      username,
      password,
    });
    if (response.status === 200) {
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      apiWithoutAuth.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
    }
    return response;
  } catch (error) {
    throw error;
  }
};

const refreshToken = async () => {
  try {
    const response = await apiWithAuth.post(
      "/auth/refresh-token",
      {},
      { withCredentials: true }
    );
    if (response.status === 200) {
      const { token } = response.data;
      localStorage.setItem("token", token);
      apiWithoutAuth.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
    }
    return response;
  } catch (error) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw error;
  }
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  delete apiWithoutAuth.defaults.headers.common["Authorization"];
  window.location.href = "/login";
};

const authService = {
  login,
  logout,
  refreshToken,
};

export default authService;
