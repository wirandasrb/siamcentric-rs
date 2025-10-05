import { apiWithAuth } from "./apiConfig"

const getAnswerFromResult = async (form_id) => {
    try {
        const response = await apiWithAuth.get(`/answers/${form_id}`);
        return response.data
    } catch (error) {
        console.error("Error fetching answers:", error)
        throw error
    }
}

const reportService = {
    getAnswerFromResult
}

export default reportService