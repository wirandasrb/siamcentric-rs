import { HomeOutlined, LockClockOutlined } from "@mui/icons-material";
import { Box, Divider, Typography } from "@mui/material";

const SurveyClosed = ({ survey }) => {
    return (
        <Box sx={{
            width: { xs: "90%", md: "600px" },
            backgroundColor: "white",
            borderRadius: 4,
            boxShadow: "0px 10px 40px rgba(0,0,0,0.1)",
            overflow: "hidden",
            textAlign: "center",
            mt: 4
        }}>
            <Box sx={{
                height: 8,
                width: '100%',
                background: `linear-gradient(90deg, ${survey?.primary_color || "#1976d2"} 0%,  rgba(255, 255, 255, 0.4) 100%)`,
                backgroundColor: survey?.primary_color || "#1976d2",
            }} />

            <Box sx={{ p: { xs: 4, md: 6 } }}>
                <Box sx={{
                    backgroundColor: '#ffd8d8',
                    p: 3,
                    borderRadius: '50%',
                    width: 'fit-content',
                    m: '0 auto 24px'
                }}>
                    <LockClockOutlined sx={{
                        fontSize: 60,
                        color:
                            '#ff4d4d'
                    }} />
                </Box>

                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, color: '#ff4d4d' }}>
                    ปิดรับการตอบแบบสำรวจ
                </Typography>

                <Box sx={{ backgroundColor: "#f8f9fa", p: 3, borderRadius: 2, mb: 4 }}>
                    <Typography variant="body1" sx={{ color: "#555", lineHeight: 1.6 }}>
                        ขออภัย ขณะนี้แบบสำรวจ <b>{survey.title}</b> ได้ปิดรับข้อมูลหรือสิ้นสุดระยะเวลาการทำแบบสำรวจแล้ว
                        ขอบคุณที่ท่านให้ความสนใจ
                    </Typography>
                </Box>

                <Divider sx={{ mb: 4 }} />
            </Box>
        </Box >
    );
};
export default SurveyClosed;