import { apiWithAuth } from "./apiConfig";

const getInvitations = async (formId, params = {}) => {
  const response = await apiWithAuth.get(`/invites/${formId}`, {
    params: {
      page: params.page ?? 1,
      page_size: params.page_size ?? 25,
      search: params.search ?? "",
    },
  });

  return response.data;
};

const getInvitationSummary = async (formId) => {
  const response = await apiWithAuth.get(`/invites/${formId}/summary`);

  return response.data;
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

const importExcelInvitations = async (formId, file) => {
  const formData = new FormData();

  formData.append("file", file, file.name);

  const response = await apiWithAuth.post(
    `/invites/${formId}/import-excel`,
    formData,
    {
      headers: {
        "Content-Type": undefined,
      },
    }
  );

  return response.data;
};

const sendInvitationEmailById = async (formId, invitationId) => {
  const response = await apiWithAuth.post(
    `/invites/${formId}/${invitationId}/send-email`
  );

  return response.data;
};

const dispatchInvitations = async (formId, scope) => {
  const response = await apiWithAuth.post(`/invites/${formId}/dispatch-email`, {
    scope,
  });

  return response.data;
};

const exportInvitations = async (formId, search = "") => {
  const response = await apiWithAuth.get(`/invites/${formId}/export`, {
    params: { search },
    responseType: "blob",
  });

  return response.data;
};

const invitationService = {
  getInvitations,
  createInvitation,
  sendInvitationEmail,
  updateSubmitSurveyInvitation,
  importExcelInvitations,
  sendInvitationEmailById,
  getInvitationSummary,
  dispatchInvitations,
  exportInvitations,
};

export default invitationService;
