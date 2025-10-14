"use client";
import { Box, CircularProgress, Typography } from "@mui/material";

export default function Loading() {
    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
            }}
        >
            <CircularProgress />
            <Typography>กำลังโหลดแบบสอบถาม...</Typography>
        </Box>
    );
}
