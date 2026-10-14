import React from "react";
import { Box, LinearProgress, Typography, Stack } from "@mui/material";

const ProgressBarSection = ({
  activeStep,
  totalSteps,
  answeredQuestions = 0,
  totalQuestions = 0,
  progress = 0,
  primaryColor = "#1976d2",
}) => {
  return (
    <Box sx={{ width: { xs: "90%", lg: "60%" }, mb: 3 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-end"
        sx={{ mb: 1 }}
      >
        <Box
          sx={{
            backgroundColor: "#e3f2fd",
            color: primaryColor,
            px: 2,
            py: 0.5,
            borderRadius: "20px",
            fontSize: "0.85rem",
            fontWeight: "bold",
          }}
        >
          ส่วนที่ {activeStep + 1} / {totalSteps}
        </Box>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", fontWeight: 500 }}
        >
          {progress}% Completed
        </Typography>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 8,
          borderRadius: 5,
          backgroundColor: "#ebebeb",
          "& .MuiLinearProgress-bar": {
            borderRadius: 5,
            background: `linear-gradient(90deg, ${primaryColor} 0%, #4facfe 100%)`,
          },
        }}
      />

      {/* <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", textAlign: "right", mt: 1 }}
      >
        ตอบแล้ว {answeredQuestions} จาก {totalQuestions} คำถาม
      </Typography> */}
    </Box>
  );
};

export default ProgressBarSection;
