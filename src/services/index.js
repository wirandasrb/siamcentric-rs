import dashboardService from "./dashboardService";
import externalService from "./externalService";
import formService from "./formService";
import questionService from "./questionService";
import reportService from "./reportService";
import surveyService from "./surveyService";
import userService from "./userService";

const useApi = {
    forms: formService,
    questions: questionService,
    surveys: surveyService,
    dashboards: dashboardService,
    reports: reportService,
    external: externalService,
    users: userService,
};

export default useApi;
