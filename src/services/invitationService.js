import { apiWithAuth } from "./apiConfig";

/**
 * กติกาการคืนค่าเหมือน formService/reportService:
 * คืน response.data ซึ่งในโปรเจกต์มักมีรูปร่าง { data: ... } อีกชั้น
 * Token/URL แบบเฉพาะคนจะคืนเฉพาะผลของ createInvitation เท่านั้น
 */
const getInvitations = async (formId, params = {}) => {
  try {
    const response = await apiWithAuth.get(`/invites/${formId}`, { params });

    return response.data;
  } catch (error) {
    console.error("Error fetching invitations:", error);
    throw error;
  }
};

const createInvitation = async (formId, payload) => {
  const response = await apiWithAuth.post(`/invites/${formId}`, payload);
  return response.data;
};

const sendInvitationEmail = async (formId, payload) => {
  const response = await apiWithAuth.post(
    `/invites/${formId}/send-email`,
    payload
  );
  return response.data;
};

const updateSubmitSurveyInvitation = async (formId, invite_code, data) => {
  const response = await apiWithAuth.put(
    `/invites/${formId}/${invite_code}`,
    data
  );
  return response.data;
};
const invitationService = {
  getInvitations,
  createInvitation,
  sendInvitationEmail,
  updateSubmitSurveyInvitation,
};

export default invitationService;
