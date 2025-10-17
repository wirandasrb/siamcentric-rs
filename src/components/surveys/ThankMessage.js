"use client";
import { MarkChatRead, Share } from "@mui/icons-material";
import { Box, Button, Divider, IconButton, lighten, Typography } from "@mui/material";
import SnackbarCustomized from "../Snackbar";
import React from "react";

const ThankMessage = ({
    form,
    onRetakeSurvey
}) => {
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const handleShare = (platform) => {
        const surveyLink = window.location.href;
        let shareUrl = "";
        if (platform === "facebook") {
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(surveyLink)}`;
            window.open(shareUrl, "_blank");
        } else if (platform === "line") {
            shareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(surveyLink)}`;
            window.open(shareUrl, "_blank");
        } else if (platform === "copy") {
            navigator.clipboard.writeText(surveyLink).then(() => {
                setSnackbarOpen(true);
            });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };



    return (
        <>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "white",
                width: {
                    xs: "90%", // หน้าจอเล็ก
                    sm: "80%", // หน้าจอกลาง
                    md: "80%", // หน้าจอใหญ่
                    lg: "60%", // หน้าจอใหญ่มาก
                },
                height: "auto",
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: 3,
                gap: 2,
                mt: 4, // เพิ่ม margin-top เพื่อให้ไม่ติดขอบจอ
                p: 4,
            }}>
                <Box
                    sx={{
                        mt: 4,
                        width: "200px",
                        height: "200px",
                        display: "flex",
                        justifyContent: "center",
                        mb: 2,
                        alignItems: "center",
                        borderRadius: "50%",
                        backgroundColor: lighten(form?.primary_color, 0.3),
                    }}
                >
                    <MarkChatRead
                        sx={{
                            fontSize: 120,
                            color: "white",
                        }}
                    />
                </Box>
                <Typography
                    sx={{
                        fontSize: 24,
                        fontWeight: "bold",
                        textAlign: "center",
                        color: form?.primary_color,
                    }}
                >
                    ขอบคุณสำหรับการตอบแบบสอบถาม!
                </Typography>
                <Typography
                    sx={{
                        fontSize: 16,
                        textAlign: "center",
                        color: "text.secondary",
                        fontWeight: 600,
                    }}
                >
                    {form?.thank_you_message || "เราจะนำข้อมูลของคุณไปใช้ในการปรับปรุงและพัฒนาบริการของเราให้ดียิ่งขึ้น"}
                </Typography>

                {/* copy link or share button facebook  and line*/}
                <Box sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 2,
                    mt: 4,
                    mb: 4,

                }}>
                    {/* Add your share buttons here */}
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: form?.primary_color,
                            borderRadius: 3,
                            boxShadow: 'none',
                            color: 'white',
                            height: 40,
                            minWidth: 150,
                            '&:hover': {
                                backgroundColor: lighten(form?.primary_color, 0.2),
                            },

                        }}
                        startIcon={<Share />}
                        onClick={() => {
                            handleShare("copy");
                        }}
                    >
                        คัดลอกลิงก์
                    </Button>
                    {form?.show_facebook_share && (
                        <IconButton
                            onClick={() => {
                                handleShare("facebook");
                            }}
                        >
                            <img src="/icons/facebook.png" alt="Facebook" style={{ width: 30, height: 30 }} />
                        </IconButton>
                    )}
                    {form?.show_line_share && (
                        <IconButton
                            onClick={() => {
                                handleShare("line");
                            }}
                        >
                            <img src="/icons/line.png" alt="Line" style={{ width: 30, height: 30 }} />
                        </IconButton>
                    )}
                </Box>

                {
                    form?.allow_multiple_answers && (
                        <>
                            <Divider sx={{ width: '80%' }} />
                            <Button
                                variant="outlined"
                                color="primary"

                                sx={{
                                    mb: 4,
                                    borderRadius: 5,
                                    width: '80%',
                                }}
                                onClick={() => {
                                    onRetakeSurvey();
                                }}
                            >
                                ตอบแบบสอบถามอีกครั้ง
                            </Button>
                        </>
                    )
                }
            </Box>
            <SnackbarCustomized
                id="copy-link-snackbar"
                message="คัดลอกลิงก์สำเร็จ!"
                severity="success"
                autoHideDuration={3000}
                open={snackbarOpen}
                onClose={handleCloseSnackbar}
            />

        </>
    );
};

export default ThankMessage;
