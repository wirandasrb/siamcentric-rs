import { apiWithAuth } from "./apiConfig";

const getListUser = async () => {
    // Call API get list user
    try {
        const response = await apiWithAuth.get('/users');
        return response.data;
    } catch (error) {
        console.error("Error fetching user list:", error);
        throw error;
    }
};

const getUserById = async (id) => {
    // Call API get user by ID
    try {
        const response = await apiWithAuth.get(`/users/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        throw error;
    }
};

const createUser = async (userData) => {
    // Call API create new user
    try {
        const response = await apiWithAuth.post('/users', userData);
        return response.data;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

const updateUser = async (id, userData) => {
    // Call API update user by ID
    try {
        const response = await apiWithAuth.put(`/users/${id}`, userData);
        return response.data;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};

const userService = {
    getListUser,
    getUserById,
    createUser,
    updateUser,
};

export default userService;