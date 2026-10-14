import dashboardService from "./dashboardService";
import emailCampaignService from "./emailCampaignService";
import emailSettingService from "./emailSettingService";
import externalService from "./externalService";
import formService from "./formService";
import invitationService from "./invitationService";
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
  invitation: invitationService,
  emailSettings: emailSettingService,
  emailCampaigns: emailCampaignService,
};

export default useApi;
