import { apiWithAuth } from "./apiConfig";

const getDashboardData = async () => {
    try {
        const response = await apiWithAuth.get('/dashboard');
        return response.data;
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        throw error;
    }
};

const dashboardService = {
    getDashboardData,
};

export default dashboardService;