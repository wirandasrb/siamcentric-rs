import { apiWithoutAuth } from "./apiConfig";

const getSurveyById = async (id) => {
    try {
        const response = await apiWithoutAuth.get(`/surveys/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching survey:", error);
        throw error;
    }
};
const surveyService = {
    getSurveyById,
};

export default surveyService;