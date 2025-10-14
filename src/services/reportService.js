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

const exportExcelSurvey = async (form_id) => {
    try {
        const response = await apiWithAuth.get(`/answers/${form_id}/excel`, {
            responseType: "blob",
        });

        const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", });
        const fileUrl = URL.createObjectURL(blob);
        return {
            file_url: fileUrl,
            file_name: `ผลลัพธ์แบบสำรวจ_${form_id}.xlsx`,
        };
    } catch (error) {
        console.error("Error exporting Excel:", error);
        throw error;
    }
}

const exportExcelCoding = async (form_id) => {
    try {
        const response = await apiWithAuth.get(`/exports/questions/${form_id}`, {
            responseType: "blob",
        });
        const blob = new Blob([response.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const fileUrl = URL.createObjectURL(blob);
        return {
            file_url: fileUrl,
            file_name: `คำถามแบบสำรวจ_${form_id}.xlsx`,
        };
    } catch (error) {
        console.error("Error exporting Excel:", error);
        throw error;
    }
}

const reportService = {
    getAnswerFromResult,
    exportExcelSurvey,
    exportExcelCoding
}

export default reportService