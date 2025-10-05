import { apiWithAuth } from './apiConfig.js';

const getFormsList = async () => {
    try {
        const response = await apiWithAuth.get("/forms");
        return response.data;
    } catch (error) {
        console.error("Error fetching forms:", error);
        throw new Error("Failed to fetch forms");
    }
};

const getFormById = async (formId) => {
    try {
        const response = await apiWithAuth.get(`/forms/${formId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching form:", error);
        throw new Error("Failed to fetch form");
    }
};

const updateFormStatus = async (formId, is_open) => {
    try {
        const response = await apiWithAuth.put(`/forms/${formId}/openform`, { is_open });
        return response.data;
    } catch (error) {
        console.error("Error updating form status:", error);
        throw new Error("Failed to update form status");
    }
};

const createForm = async (formData) => {
    try {
        const response = await apiWithAuth.post("/forms", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    } catch (error) {
        console.error("Error creating form:", error);
        throw new Error("Failed to create form");
    }
};

const updateForm = async (formId, formData) => {
    try {
        const response = await apiWithAuth.put(`/forms/${formId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    } catch (error) {
        console.error("Error updating form:", error);
        throw new Error("Failed to update form");
    }
};

const formService = {
    getFormsList,
    getFormById,
    updateFormStatus,
    createForm,
    updateForm,
};

export default formService;