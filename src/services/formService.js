import { AttachEmailSharp } from "@mui/icons-material";
import { apiWithAuth } from "./apiConfig.js";

const getFormsList = async () => {
  try {
    const response = await apiWithAuth.get("/forms");
    return response.data;
  } catch (error) {
    console.error("Error fetching forms:", error);
    throw new Error("Failed to fetch forms");
  }
};

const getFormById = async (formId) => {
  try {
    const response = await apiWithAuth.get(`/forms/${formId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching form:", error);
    throw new Error("Failed to fetch form");
  }
};

const updateFormStatus = async (formId, is_open) => {
  try {
    const response = await apiWithAuth.put(`/forms/${formId}/openform`, {
      is_open,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating form status:", error);
    throw new Error("Failed to update form status");
  }
};

const createForm = async (formData) => {
  try {
    const response = await apiWithAuth.post("/forms", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating form:", error);
    throw new Error("Failed to create form");
  }
};

const updateForm = async (formId, formData) => {
  try {
    const response = await apiWithAuth.put(`/forms/${formId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating form:", error);
    throw new Error("Failed to update form");
  }
};

const deleteForm = async (formId) => {
  try {
    const response = await apiWithAuth.delete(`/forms/${formId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting form:", error);
    throw new Error("Failed to delete form");
  }
};

const getFormGoogleSheetLink = async (formId) => {
  try {
    const { data, status } = await apiWithAuth.get(
      `/forms/${formId}/google-sheet`
    );
    if (status === 200 && data) {
      return data; // ✅ ส่งข้อมูลจริงกลับไป
    }
    throw new Error("No Google Sheet link found");
  } catch (error) {
    return null; // ✅ คืนค่า null ดีกว่าโยน error กลับ เพื่อไม่ให้ UI พัง
  }
};

const addEmailSyncGoogleSheet = async (formId, emails) => {
  try {
    const response = await apiWithAuth.post(`/forms/${formId}/allowed-emails`, {
      emails,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding email to Google Sheet:", error);
    throw new Error("Failed to add email to Google Sheet");
  }
};

const createGoogleSheetLink = async (formId) => {
  try {
    const response = await apiWithAuth.post(
      `/forms/${formId}/create-google-sheet`
    );
    return response.data;
  } catch (error) {
    console.error("Error creating Google Sheet link:", error);
    throw new Error("Failed to create Google Sheet link");
  }
};

// const updateGoogleSheet = async (formId: string) => {
//   const response = await apiWithAuth.post(
//     `/forms/${formId}/update-google-sheet`
//   );
//   if (response.status === 200) {
//     return response.data;
//   }
//   throw new Error("Failed to update Google Sheet");
// };

const updateGoogleSheet = async (form_id) => {
  try {
    const response = await apiWithAuth.post(
      `/forms/${form_id}/update-google-sheet`
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error updating Google Sheet:", error);
    throw new Error("Failed to update Google Sheet");
  }
};

const getEmailSyncGoogleSheet = async (form_id) => {
  try {
    const response = await apiWithAuth.get(`/forms/${form_id}/allowed-emails`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching email sync data:", error);
    throw new Error("Failed to fetch email sync data");
  }
};

const formService = {
  getFormsList,
  getFormById,
  updateFormStatus,
  createForm,
  updateForm,
  deleteForm,
  getFormGoogleSheetLink,
  createGoogleSheetLink,
  updateGoogleSheet,
  addEmailSyncGoogleSheet,
  getEmailSyncGoogleSheet,
};

export default formService;
