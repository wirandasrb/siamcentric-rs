"use client";

import { Box, Card, CardContent } from "@mui/material";

const Cardboard = ({ title, value, icon, color, sx }) => {
    return (
        <Card
            sx={{
                ...sx,
                padding: 2,
                display: "flex",
                flexDirection: "column",
                backgroundColor: "white",
                boxShadow: "0 0 16px rgba(91, 71, 188, 0.2)",
                borderRadius: 3,
                width: '100%',
            }}
        >
            <CardContent
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    color: color,
                    width: '100%',
                }}
            >
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Box sx={{ fontSize: 18, fontWeight: "bold" }}>{title}</Box>
                    <Box sx={{ fontSize: 24 }}>{value}</Box>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: color,
                        borderRadius: "50%",
                        width: 60,
                        height: 60,
                        color: "white",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                    }}
                >
                    {icon}
                </Box>
            </CardContent>
        </Card>
    );
};

export default Cardboard;
