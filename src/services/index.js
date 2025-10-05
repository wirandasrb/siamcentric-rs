import dashboardService from "./dashboardService";
import externalService from "./externalService";
import formService from "./formService";
import questionService from "./questionService";
import reportService from "./reportService";
import surveyService from "./surveyService";

const useApi = {
    forms: formService,
    questions: questionService,
    surveys: surveyService,
    dashboards: dashboardService,
    reports: reportService,
    external: externalService,
};

export default useApi;
