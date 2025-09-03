import { apiWithoutAuth } from "./apiConfig"

const login = async (username, password) => {
    try {
        const response = await apiWithoutAuth.post('/auth/login', {
            username,
            password
        })
        if (response.status === 200) {
            const { token, user } = response.data;
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            apiWithoutAuth.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
        return response
    } catch (error) {
        throw error
    }
}

const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete apiWithoutAuth.defaults.headers.common["Authorization"];
    window.location.href = "/login";
}

const authService = {
    login,
    logout,
};

export default authService;