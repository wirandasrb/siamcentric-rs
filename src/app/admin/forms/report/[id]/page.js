"use client";
import {
  Add,
  ContentCopy,
  DatasetLinked,
  Download,
  Edit,
  ListAltOutlined,
  NoteAdd,
  Person,
} from "@mui/icons-material";
import {
  Box,
  Button,
  colors,
  Divider,
  Grid,
  IconButton,
  Link,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { useParams } from "next/navigation";
import Cardboard from "../../../../../components/Cardboard";
import React, { useEffect } from "react";
import useApi from "../../../../../services";
import ModalCreateGoogleSheet from "../../../../../components/modals/form/ModalCreateGoogleSheet";
import SnackbarCustomized from "../../../../../components/Snackbar";

const ReportPage = () => {
  const { id } = useParams();
  const [details, setDetails] = React.useState(null);
  const [googleSheet, setGoogleSheet] = React.useState(null);
  const [isOpenCreateGoogleSheet, setIsOpenCreateGoogleSheet] =
    React.useState(false);
  const [toast, setToast] = React.useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    // ดึงข้อมูลรายงานจาก API โดยใช้ id
    console.log("Fetch report data for survey ID:", id);
    if (id) {
      fetchData();
      fetchGoogleSheetLink();
    }
  }, [id]);

  const fetchData = async () => {
    // ตัวอย่างการดึงข้อมูล
    try {
      const response = await useApi.reports.getAnswerFromResult(id);
      setDetails(response.data);
    } catch (error) {
      // จัดการข้อผิดพลาด
      console.error("Error fetching report data:", error);
    }
  };

  const fetchGoogleSheetLink = async () => {
    try {
      const response = await useApi.forms.getFormGoogleSheetLink(id);
      if (response) {
        const { data } = response;
        console.log("Google Sheet link data:", data);
        setGoogleSheet(data);
      }
    } catch (error) {
      // จัดการข้อผิดพลาด
      console.error("Error fetching Google Sheet link:", error);
    }
  };

  const handleCreateGoogleSheet = async (emails) => {
    // Logic สำหรับการสร้าง Google Sheet
    try {
      // sync emails with the form ก่อนสร้าง Google Sheet
      const response = await useApi.forms.addEmailSyncGoogleSheet(id, emails);
      if (response) {
        // หลังจาก sync email สำเร็จ ค่อยสร้าง Google Sheet
        const createResponse = await useApi.forms.createGoogleSheetLink(id);
        if (createResponse) {
          // ดึงลิงก์ Google Sheet ใหม่หลังจากสร้างเสร็จ
          await fetchGoogleSheetLink();
          setIsOpenCreateGoogleSheet(false);
        }
      }
    } catch (error) {
      console.error("Error creating Google Sheet:", error);
    }
  };

  const handleUpdateGoogleSheet = async () => {
    // Logic สำหรับการอัปเดตข้อมูลภายใน Google Sheet
    try {
      const response = await useApi.forms.updateGoogleSheet(id);
      if (response) {
        setToast({
          open: true,
          message: "อัปเดตข้อมูล Google Sheet สำเร็จ",
          severity: "success",
        });
      }
    } catch (error) {
      console.error("Error updating Google Sheet:", error);
      setToast({
        open: true,
        message: "อัปเดตข้อมูล Google Sheet ไม่สำเร็จ",
        severity: "error",
      });
    }
  };

  const handleAddEmail = async (emails) => {
    try {
      const response = await useApi.forms.addEmailSyncGoogleSheet(id, emails);
      if (response) {
        // อัปเดตสถานะหรือแสดงข้อความสำเร็จตามต้องการ
        console.log("Emails added successfully");
        setIsOpenCreateGoogleSheet(false);
      }
    } catch (error) {
      console.error("Error adding emails:", error);
    }
  };

  const handleExportExcel = async () => {
    // ตัวอย่างการส่งคำขอเพื่อดาวน์โหลดไฟล์ Excel
    try {
      const response = await useApi.reports.exportExcelSurvey(id);
      if (response && response.file_url) {
        // สมมติว่า response เป็น URL ของไฟล์ Excel ที่ดาวน์โหลดได้
        const link = document.createElement("a");
        link.href = response.file_url; // URL ของไฟล์ Excel
        link.setAttribute("download", response.file_name); // ชื่อไฟล์ที่ต้องการดาวน์โหลด
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      // จัดการข้อผิดพลาด
      console.error("Error exporting Excel:", error);
    }
  };

  const handleExportDataCoding = async () => {
    // ตัวอย่างการส่งคำขอเพื่อดาวน์โหลดไฟล์ Excel
    try {
      const response = await useApi.reports.exportExcelCoding(id);
      if (response && response.file_url) {
        // สมมติว่า response เป็น URL ของไฟล์ Excel ที่ดาวน์โหลดได้
        const link = document.createElement("a");
        link.href = response.file_url; // Accessing file_url directly from the response
        link.setAttribute("download", response.file_name);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      // จัดการข้อผิดพลาด
      console.error("Error exporting Excel:", error);
    }
  };

  return (
    <>
      <Box sx={{ p: 2, width: "100%", flexGrow: 1 }}>
        <Typography variant="h5">ผลสำรวจ</Typography>

        {/* ปุ่มด้านบน */}
        <Box
          sx={{
            mt: 1,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="contained"
            sx={{
              borderRadius: 3,
              backgroundColor: colors.lightBlue[700],
              boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.2)",
              padding: "8px 16px",
              color: "white",
              "&:hover": { backgroundColor: colors.lightBlue[600] },
            }}
            startIcon={<DatasetLinked />}
            onClick={() => {
              if (googleSheet && googleSheet?.sheet_url) {
                window.open(googleSheet?.sheet_url, "_blank");
              } else {
                setIsOpenCreateGoogleSheet(true);
              }
            }}
          >
            Google Sheet
          </Button>

          <Button
            variant="contained"
            sx={{
              borderRadius: 3,
              backgroundColor: colors.green[700],
              boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.2)",
              padding: "8px 16px",
              color: "white",
              "&:hover": { backgroundColor: colors.green[600] },
            }}
            startIcon={<Download />}
            onClick={handleExportExcel}
          >
            Export Excel
          </Button>

          <Button
            variant="outlined"
            sx={{
              borderRadius: 3,
              border: "2px solid",
              borderColor: colors.grey[400],
              padding: "8px 16px",
              color: colors.grey[800],
              "&:hover": {
                borderColor: colors.grey[600],
                backgroundColor: colors.grey[100],
              },
            }}
            startIcon={<ListAltOutlined />}
            onClick={handleExportDataCoding}
          >
            Data Coding
          </Button>
        </Box>

        {/* ส่วนรายงาน */}
        <Box sx={{ mt: 2, mb: 2, width: "100%" }}>
          <Grid container spacing={2} alignItems="stretch">
            <Grid item xs={12} md={3} sx={{ display: "flex" }}>
              <Cardboard
                title="จำนวนผู้ตอบแบบสอบถาม"
                value={details ? details.count_respondents : 0}
                icon={<Person />}
                color={colors.lightGreen[700]}
              />
            </Grid>
            <Grid item xs={12} md={9} sx={{ display: "flex" }}>
              <Box
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  backgroundColor: "white",
                  boxShadow: "0 0 16px rgba(91, 71, 188, 0.2)",
                  borderRadius: 3,
                  minHeight: 200,
                }}
              >
                <Box
                  sx={{
                    gap: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 3,
                    width: "100%",
                    minHeight: 100,
                    p: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        my: "auto",
                        color: colors.grey[800],
                        fontWeight: 600,
                        noWrap: true,
                      }}
                    >
                      Link Google Sheet :
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          googleSheet && googleSheet?.sheet_url
                            ? "primary.main"
                            : "text.secondary",
                      }}
                    >
                      {googleSheet && googleSheet?.sheet_url ? (
                        <Link
                          href={googleSheet?.sheet_url}
                          target="_blank"
                          rel="noopener"
                        >
                          {googleSheet?.sheet_url}
                        </Link>
                      ) : (
                        "ยังไม่มีการสร้าง Google Sheet"
                      )}
                    </Typography>
                  </Box>
                  {!googleSheet && !googleSheet?.sheet_url ? (
                    <Box
                      sx={{
                        mt: 2,
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<NoteAdd />}
                        sx={{
                          borderRadius: 3,
                        }}
                        onClick={() => setIsOpenCreateGoogleSheet(true)}
                      >
                        สร้าง Google Sheet
                      </Button>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        mt: 2,
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Tooltip title="คัดลอกลิงก์">
                        <IconButton
                          color="primary"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              googleSheet?.sheet_url
                            );
                            setToast({
                              open: true,
                              message: "คัดลอกลิงก์สำเร็จ",
                              severity: "success",
                            });
                          }}
                        >
                          <ContentCopy />
                        </IconButton>
                      </Tooltip>
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<Edit />}
                        sx={{
                          borderRadius: 3,
                        }}
                        onClick={handleUpdateGoogleSheet}
                      >
                        อัปเดตข้อมูลชีท
                      </Button>
                      <Button
                        variant="outlined"
                        color="success"
                        startIcon={<Add />}
                        sx={{
                          borderRadius: 3,
                          ml: 2,
                        }}
                        onClick={() => {
                          setIsOpenCreateGoogleSheet(true);
                        }}
                      >
                        เพิ่มอีเมล
                      </Button>
                    </Box>
                  )}
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    mt: 2,
                  }}
                >
                  {details ? details.form?.title : ""}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "text.secondary",
                    mt: 2,
                    marginLeft: 1,
                  }}
                >
                  {details ? details.form?.description : ""}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <ModalCreateGoogleSheet
        open={isOpenCreateGoogleSheet}
        onClose={() => setIsOpenCreateGoogleSheet(false)}
        onCreate={googleSheet ? handleAddEmail : handleCreateGoogleSheet}
        formId={id}
        isEdit={Boolean(googleSheet)}
      />
      <SnackbarCustomized
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </>
  );
};

export default ReportPage;
