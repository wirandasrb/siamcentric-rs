import { apiWithAuth } from "./apiConfig";

// โครงเดียวกับ formService/reportService: คืน response.data โดยไม่ unwrap data ชั้นใน
const getCampaign = async (formId) => {
  const response = await apiWithAuth.get(`/forms/${formId}/email-campaign`);
  return response.data;
};

const saveCampaign = async (formId, payload) => {
  const response = await apiWithAuth.put(`/forms/${formId}/email-campaign`, payload);
  return response.data;
};

const getCampaignSummary = async (formId) => {
  const response = await apiWithAuth.get(`/forms/${formId}/email-campaign/summary`);
  return response.data;
};

// ส่งงานไปประมวลผลที่ Backend ไม่ต้องนำอีเมล 6,000 คนมาส่งจาก Browser
const dispatchCampaign = async (formId, scope) => {
  const response = await apiWithAuth.post(`/forms/${formId}/email-campaign/dispatch`, {
    scope, // unsent | failed
  });
  return response.data;
};

// ให้ Admin คัดลอกลิงก์เดิมได้โดย Backend ถอดรหัส Token ที่เข้ารหัสเก็บไว้
const getInvitationLink = async (formId, invitationId) => {
  const response = await apiWithAuth.post(`/forms/${formId}/invitations/${invitationId}/copy-link`);
  return response.data;
};

// ใช้ pagination และ search ฝั่ง Server เสมอ
const getInvitations = async (formId, params = {}) => {
  const response = await apiWithAuth.get(`/forms/${formId}/invitations`, { params });
  return response.data;
};

const createInvitation = async (formId, payload) => {
  const response = await apiWithAuth.post(`/forms/${formId}/invitations`, payload);
  return response.data;
};

// ส่งคนเดียว โดยใช้ Subject/Body ของ Campaign ที่บันทึกแล้วเท่านั้น
const sendInvitationEmail = async (formId, payload) => {
  const response = await apiWithAuth.post(`/forms/${formId}/invitations/send-email`, payload);
  return response.data;
};

// Preview โดย Backend เป็นผู้ parse / deduplicate ไม่ส่งอีเมลทันที
const previewRecipientsFile = async (formId, file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await apiWithAuth.post(
    `/forms/${formId}/email-campaign/recipients/imports/preview-file`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
    // ใช้แบบเดียวกับ formService; Axios/browser จะใส่ boundary ให้
  );
  return response.data;
};

const previewRecipientsSheet = async (formId, sheetUrl) => {
  const response = await apiWithAuth.post(
    `/forms/${formId}/email-campaign/recipients/imports/preview-sheet`,
    { sheet_url: sheetUrl }
  );
  return response.data;
};

// Commit ใช้ import_id ของข้อมูล snapshot ที่พรีวิวไว้ใน Backend
const commitRecipientsImport = async (formId, importId) => {
  const response = await apiWithAuth.post(
    `/forms/${formId}/email-campaign/recipients/imports/${encodeURIComponent(importId)}/commit`
  );
  return response.data;
};

const emailCampaignService = {
  getCampaign,
  saveCampaign,
  getCampaignSummary,
  dispatchCampaign,
  getInvitations,
  getInvitationLink,
  createInvitation,
  sendInvitationEmail,
  previewRecipientsFile,
  previewRecipientsSheet,
  commitRecipientsImport,
};

export default emailCampaignService;
