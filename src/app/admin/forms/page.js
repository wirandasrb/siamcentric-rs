"use client";
import {
  Add,
  Delete,
  Edit,
  OfflineShare,
  OpenInNew,
  Visibility,
} from "@mui/icons-material";
import {
  Box,
  Button,
  colors,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import TableComponent from "../../../components/Table";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import useApi from "../../../services";
import { formatDateTH } from "../../../helpers/format";
import Actions from "../../../components/Actions";
import SnackbarCustomized from "../../../components/Snackbar";
import ModalConfirm from "../../../components/modals/ModalComfirm";

const FormsPage = () => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [toastOpen, setToastOpen] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [isModalDeleteOpen, setIsModalDeleteOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await useApi.forms.getFormsList();
      if (response.status === "success") {
        setData(response.data);
      } else {
        console.error("Failed to fetch forms:", response.message);
      }
    } catch (error) {
      console.error("Failed to fetch forms:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatusForm = async (formId, newStatus) => {
    try {
      const response = await useApi.forms.updateFormStatus(formId, newStatus);
      if (response.success) {
        // Update the local state with the new status
        setData((prevData) =>
          prevData.map((form) =>
            form.id === formId ? { ...form, is_open: newStatus } : form
          )
        );
      } else {
        console.error("Failed to update form status:", response.message);
      }
    } catch (error) {
      console.error("Failed to update form status:", error);
    }
  };

  const handleCopyLink = (form) => {
    // copy link to clipboard ต้องใช้ code_link ด้วย
    const link = `${window.location.origin}/surveys/${form.code_link}`;
    navigator.clipboard.writeText(link);
    setToastOpen({
      open: true,
      message: "คัดลอกลิงก์สำเร็จ",
      severity: "success",
    });
  };

  const handleDeleteForm = async (formId) => {
    try {
      const response = await useApi.forms.deleteForm(formId);
      if (response.success) {
        setIsModalDeleteOpen(false);
        setSelectedRow(null);
        // Remove the deleted form from local state
        fetchData();
        setToastOpen({
          open: true,
          message: "ลบแบบสอบถามสำเร็จ",
          severity: "success",
        });
      } else {
        console.error("Failed to delete form:", response.message);
        setToastOpen({
          open: true,
          message: "ลบแบบสอบถามไม่สำเร็จ",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Failed to delete form:", error);
      setToastOpen({
        open: true,
        message: "ลบแบบสอบถามไม่สำเร็จ",
        severity: "error",
      });
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5">รายการแบบสอบถาม</Typography>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          sx={{
            textTransform: "none",
            borderRadius: 3,
            boxShadow: "none",
            color: "#fff",
            fontSize: 14,
            "&:hover": {
              boxShadow: "none",
            },
          }}
          onClick={() => {
            // redirect to create form page
            router.push("/admin/forms/create");
          }}
        >
          สร้างแบบสอบถาม
        </Button>
      </Box>
      <Box
        sx={{
          mt: 2,
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Box sx={{ p: 2 }}>
          <TableComponent
            data={data || []}
            columns={[
              {
                id: "title",
                label: "ชื่อแบบสอบถาม",
              },
              {
                id: "creator",
                label: "ผู้สร้าง",
                render: (row) => (
                  <Typography variant="body2">
                    {row.creator.firstname}
                  </Typography>
                ),
              },
              {
                id: "created_at",
                label: "วันที่สร้าง",
                render: (row) => formatDateTH(row.created_at),
              },
              {
                id: "updated_at",
                label: "วันที่แก้ไขล่าสุด",
                render: (row) => formatDateTH(row.updated_at),
              },
              {
                id: "is_open",
                label: "สถานะ",
                render: (row) => (
                  <Tooltip title="เปิด/ปิด แบบสอบถาม">
                    <Switch
                      checked={row.is_open}
                      onChange={(e) =>
                        handleUpdateStatusForm(row.id, e.target.checked)
                      }
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: "#4caf50", // สีปุ่ม toggle ตอนเปิด (เขียว)
                          "&:hover": {
                            backgroundColor: "rgba(76, 175, 80, 0.08)", // เขียวอ่อนตอน hover
                          },
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                          {
                            backgroundColor: "#4caf50", // สีแถบพื้นหลังตอนเปิด
                          },
                      }}
                    />
                  </Tooltip>
                ),
              },
              {
                id: "actions",
                label: "ดำเนินการ",
                render: (row) => (
                  <Actions
                    menuList={[
                      {
                        label: "แก้ไข",
                        icon: (
                          <Edit
                            sx={{
                              color: colors.yellow[700],
                            }}
                          />
                        ),
                        onClick: () => router.push(`/admin/forms/${row.id}`),
                      },
                      {
                        label: "ผลสำรวจ",
                        icon: <Visibility sx={{ color: colors.blue[700] }} />,
                        onClick: () =>
                          router.push(`/admin/forms/report/${row.id}`),
                      },
                      {
                        label: "ไปยังแบบสอบถาม",
                        icon: <OpenInNew sx={{ color: colors.green[700] }} />,
                        onClick: () => {
                          // open form in new tab
                          window.open(`/surveys/${row.code_link}`, "_blank");
                        },
                      },
                      {
                        label: "คัดลอกลิงก์",
                        icon: <OfflineShare />,
                        onClick: () => handleCopyLink(row),
                      },
                      {
                        label: "ลบ",
                        icon: (
                          <Delete
                            sx={{
                              color: colors.red[700],
                            }}
                          />
                        ),
                        onClick: async () => {
                          // delete form
                          setIsModalDeleteOpen(true);
                          setSelectedRow(row);
                        },
                      },
                    ]}
                  />
                ),
              },
            ]}
            isLoading={loading}
          />
        </Box>
      </Box>
      <SnackbarCustomized
        id="form-toast"
        message={toastOpen.message}
        severity={toastOpen.severity}
        autoHideDuration={3000}
        open={toastOpen.open}
        onClose={() => setToastOpen({ ...toastOpen, open: false })}
      />
      <ModalConfirm
        open={isModalDeleteOpen}
        onClose={() => setIsModalDeleteOpen(false)}
        onConfirm={() => {
          // Call delete function here
          handleDeleteForm(selectedRow.id);
        }}
        title="ยืนยันการลบแบบสอบถาม"
        description="คุณแน่ใจหรือว่าต้องการลบแบบสอบถามนี้? การดำเนินการนี้ไม่สามารถย้อนกลับได้"
      />
    </Box>
  );
};

export default FormsPage;
