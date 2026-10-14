import { apiWithAuth } from "./apiConfig";

const getEmailSettings = async () => {
  const response = await apiWithAuth.get("/admin/email-settings");
  return response.data;
};

const updateEmailSettings = async (payload) => {
  const response = await apiWithAuth.put("/admin/email-settings", payload);
  return response.data;
};

// ทดสอบจากค่าที่บันทึกแล้ว ไม่ส่ง SMTP Password ใน request ทดสอบ
const testEmailSettings = async (testEmail) => {
  const response = await apiWithAuth.post("/admin/email-settings/test", {
    test_email: testEmail,
  });
  return response.data;
};

const emailSettingService = {
  getEmailSettings,
  updateEmailSettings,
  testEmailSettings,
};

export default emailSettingService;
