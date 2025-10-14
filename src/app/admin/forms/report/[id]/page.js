"use client";
import { DatasetLinked, Download, ListAltOutlined, Person } from "@mui/icons-material";
import { Box, Button, colors, Grid, Paper, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import Cardboard from "../../../../../components/Cardboard";
import React, { useEffect } from "react";
import useApi from "../../../../../services";

const ReportPage = () => {
    const { id } = useParams();
    const [details, setDetails] = React.useState(null);

    useEffect(() => {
        // ดึงข้อมูลรายงานจาก API โดยใช้ id
        console.log("Fetch report data for survey ID:", id);
        if (id) {
            fetchData();
        }
    }, [id]);

    const fetchData = async () => {
        // ตัวอย่างการดึงข้อมูล
        try {
            const response = await useApi.reports.getAnswerFromResult(id);
            console.log("Report data:", response);
            setDetails(response.data);
            // จัดการข้อมูลที่ได้รับ
        } catch (error) {
            // จัดการข้อผิดพลาด
        }
    };

    const handleExportExcel = async () => {
        // ตัวอย่างการส่งคำขอเพื่อดาวน์โหลดไฟล์ Excel
        try {
            const response = await useApi.reports.exportExcelSurvey(id);
            if (response && response.file_url) {
                // สมมติว่า response เป็น URL ของไฟล์ Excel ที่ดาวน์โหลดได้
                const link = document.createElement('a');
                link.href = response.file_url; // URL ของไฟล์ Excel
                link.setAttribute('download', response.file_name); // ชื่อไฟล์ที่ต้องการดาวน์โหลด
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (error) {
            // จัดการข้อผิดพลาด
            console.error("Error exporting Excel:", error);
        }
    }

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
    }

    return (
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
                    <Grid item xs={12} md={3} sx={{ display: 'flex' }}>
                        <Cardboard
                            title="จำนวนผู้ตอบแบบสอบถาม"
                            value={details ? details.count_respondents : 0}
                            icon={<Person />}
                            color={colors.lightGreen[700]}
                        />
                    </Grid>
                    <Grid item xs={12} md={9} sx={{ display: 'flex' }}>
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
                            <Typography variant="h5">{details ? details.form?.title : ""}</Typography>
                            <Typography variant="body1" sx={{
                                mt: 1, whiteSpace: 'pre-line', color: 'text.secondary',
                            }}>
                                {details ? details.form?.description : ""}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default ReportPage;
