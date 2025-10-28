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

const submitSurveyAnswers = async (data) => {
  try {
    const response = await apiWithoutAuth.post(`/surveys/submit`, data);
    return response.data;
  } catch (error) {
    console.error("Error submitting survey answers:", error);
    throw error;
  }
};

const checkResponseToken = async (survey_id, token) => {
  try {
    const response = await apiWithoutAuth.get(
      `/surveys/${survey_id}/check-token/${token}`
    );
    return response.data;
  } catch (error) {
    console.error("Error checking response token:", error);
    throw error;
  }
};

const surveyService = {
  getSurveyById,
  submitSurveyAnswers,
  checkResponseToken,
};

export default surveyService;
