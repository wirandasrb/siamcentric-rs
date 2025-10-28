import axios from "axios";

const base_url =
  process.env.NEXT_PUBLIC_BASE_URL_API || "http://localhost:8000/api";

const apiWithoutAuth = axios.create({
  baseURL: base_url,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  // withCredentials: true,
});

const apiWithAuth = axios.create({
  baseURL: base_url,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  // withCredentials: true,
});

apiWithAuth.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiWithAuth.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response) {
      // Access Token was expired
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const rs = await apiWithoutAuth.post(
            "/auth/refresh-token",
            {},
            { withCredentials: true }
          );
          const { token } = rs.data;
          localStorage.setItem("token", token);
          apiWithAuth.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${token}`;
          return apiWithAuth(originalRequest);
        } catch (_error) {
          localStorage.removeItem("token");
          window.location.href = "/login";
          return Promise.reject(_error);
        }
      }
    }
    return Promise.reject(error);
  }
);
// apiWithAuth.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (error.response.status === 401) {
//       // refresh token expired or invalid
//       localStorage.removeItem("token");
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

export { apiWithoutAuth, apiWithAuth };
