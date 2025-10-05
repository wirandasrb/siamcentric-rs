import { apiWithoutAuth } from './apiConfig.js';

const getExternalSources = async () => {
    try {
        const response = await apiWithoutAuth.get('/questions/external-sources');
        return response.data;
    } catch (error) {
        throw error;
    }
};

const questionService = {
    getExternalSources,
};

export default questionService;