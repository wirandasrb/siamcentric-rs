import { apiWithAuth } from "./apiConfig";

const getCampaignByFormId = async (formId) => {
  const response = await apiWithAuth.get(`/email/${formId}/campaigns`);
  return response.data;
};

const updateCampaign = async (campaign_id, payload) => {
  const response = await apiWithAuth.patch(
    `/email/campaigns/${campaign_id}`,
    payload
  );
  return response.data;
};

const createCampaign = async (formId, payload) => {
  const response = await apiWithAuth.post(
    `/email/${formId}/campaigns`,
    payload
  );
  return response.data;
};

const emailCampaignService = {
  getCampaignByFormId,
  updateCampaign,
  createCampaign,
};

export default emailCampaignService;
