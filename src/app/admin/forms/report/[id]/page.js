"use client";
import { DatasetLinked, Download, ListAltOutlined, Person } from "@mui/icons-material";
import { Box, Button, colors, Grid, Paper, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import Cardboard from "../../../../../components/Cardboard";

const ReportPage = () => {
    const { id } = useParams();

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
                >
                    Data Coding
                </Button>
            </Box>

            {/* ส่วนรายงาน */}
            <Box sx={{ mt: 2, mb: 2, width: "100%" }}>
                <Grid container spacing={2} >
                    <Grid item xs={12} md={3}>
                        <Cardboard
                            title="จำนวนผู้ตอบแบบสอบถาม"
                            value="150"
                            icon={<Person />}
                            color={colors.lightGreen[700]}
                        />
                    </Grid>
                    <Grid item xs={12} md={9}>
                        <Paper
                            sx={{
                                p: 2,
                                backgroundColor: "white",
                                boxShadow: 3,
                                borderRadius: 2,
                                width: "100%",
                                minHeight: 200,
                            }}
                        >
                            <Typography variant="h6">ชื่อแบบสอบถาม</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default ReportPage;
