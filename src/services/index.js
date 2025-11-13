import dashboardService from "./dashboardService";
import externalService from "./externalService";
import formService from "./formService";
import inviteService from "./inviteService";
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
    invites: inviteService,
};

export default useApi;
