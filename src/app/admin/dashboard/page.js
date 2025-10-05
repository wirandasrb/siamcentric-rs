"use client";
import { Box, Grid, Typography } from "@mui/material";
import useApi from "../../../services";
import React, { useEffect } from "react";
import Cardboard from "../../../components/Cardboard";
import { FileCopy, FileOpen, FolderOff, NoteAlt } from "@mui/icons-material";

const DashBoardPage = () => {
    const [data, setData] = React.useState(null);

    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        // Fetch dashboard data here
        try {
            const response = await useApi.dashboards.getDashboardData();
            setData(response);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    }
    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h5">Dashboard</Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Cardboard
                        title="แบบสำรวจที่เปิด"
                        value={data?.forms_open || "0"}
                        icon={<FileOpen />}
                        color="#4caf50"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Cardboard
                        title="แบบสำรวจที่ปิด"
                        value={data?.forms_closed || "0"}
                        icon={<FolderOff />}
                        color="#f44336"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Cardboard
                        title="แบบสำรวจทั้งหมด"
                        value={data?.forms_total || "0"}
                        icon={<FileCopy />}
                        color="#2196f3"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Cardboard
                        title="แบบสำรวจฉบับร่าง"
                        value={data?.forms_draft || "0"}
                        icon={<NoteAlt />}
                        color="#ff9800"
                    />
                </Grid>
            </Grid>
        </Box>

    )
}

export default DashBoardPage;