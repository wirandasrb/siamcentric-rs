import { apiWithAuth } from "./apiConfig";

const getInviteCodeByFormId = async (formId, filter) => {
    try {
        const response = await apiWithAuth.get(`/invite/${formId}`
            , { params: filter });
        return response.data;
    } catch (error) {
        console.error("Error fetching invite codes:", error);
        throw new Error("Failed to fetch invite codes");
    }
};

const createInviteCode = async (formId, inviteData) => {
    try {
        const response = await apiWithAuth.post(`/invite/${formId}`, inviteData);
        return response.data;
    } catch (error) {
        console.error("Error creating invite code:", error);
        throw new Error("Failed to create invite code");
    }
};

const deleteInviteCode = async (inviteId) => {
    try {
        const response = await apiWithAuth.delete(`/invite/${inviteId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting invite code:", error);
        throw new Error("Failed to delete invite code");
    }
};

const inviteService = {
    getInviteCodeByFormId,
    createInviteCode,
    deleteInviteCode
};

export default inviteService;