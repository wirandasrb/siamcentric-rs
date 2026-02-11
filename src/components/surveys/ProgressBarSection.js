// import { Box, Step, StepLabel, Stepper } from "@mui/material";

// const ProgressBarSection = ({
//     activeStep,
//     totalSteps,
//     primaryColor,
//     sx
// }) => {
//     return (
//         <Box
//             sx={{
//                 justifyContent: "center",
//                 backgroundColor: "white",
//                 width: {
//                     xs: "90%",
//                     sm: "80%",
//                     md: "80%",
//                     lg: "60%",
//                 },
//                 borderRadius: 3,
//                 overflow: "hidden",
//                 boxShadow: 3,
//                 mt: 4,
//                 ...sx,
//             }}
//         >
//             <Box
//                 sx={{
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     width: "100%",
//                     borderBottom: "1px solid #e0e0e0",
//                     px: 2,
//                     py: 3,
//                 }}
//             >
//                 <Stepper
//                     activeStep={activeStep}
//                     alternativeLabel
//                     sx={{
//                         width: "100%",
//                         "& .MuiStepConnector-line": {
//                             borderColor: "#e0e0e0",
//                             borderTopWidth: 2,
//                         },
//                     }}
//                 >
//                     {[...Array(totalSteps).keys()].map((step) => (
//                         <Step key={step}>
//                             <StepLabel
//                                 StepIconProps={{
//                                     sx: {
//                                         color: step === activeStep ? primaryColor : "#cfd8dc", // default สีเทาอ่อน
//                                         fontSize: 32,
//                                     },
//                                 }}
//                                 sx={{
//                                     "& .MuiStepLabel-label": {
//                                         fontSize: 13,
//                                         fontWeight: step === activeStep ? "bold" : "normal",
//                                         mt: 1,
//                                     },
//                                 }}
//                             ></StepLabel>
//                         </Step>
//                     ))}
//                 </Stepper>
//             </Box>
//         </Box>
//     );
// };

// export default ProgressBarSection;

import React from 'react';
import { Box, LinearProgress, Typography, Stack } from '@mui/material';

const ProgressBarSection = ({ activeStep, totalSteps, primaryColor }) => {
    // คำนวณเปอร์เซ็นต์
    const progress = Math.round(((activeStep + 1) / totalSteps) * 100);

    return (
        <Box sx={{ width: { xs: '90%', lg: '60%' }, mb: 3 }}>
            {/* ส่วนหัว: บอกลำดับส่วน และ เปอร์เซ็นต์ */}
            <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 1 }}>
                <Box
                    sx={{
                        backgroundColor: '#e3f2fd', // สีฟ้าอ่อนสำหรับ Label
                        color: primaryColor,
                        px: 2,
                        py: 0.5,
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                    }}
                >
                    ส่วนที่ {activeStep + 1} / {totalSteps}
                </Box>

                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    {progress}% Completed
                </Typography>
            </Stack>

            {/* แถบ Progress Bar */}
            <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                    height: 8,
                    borderRadius: 5,
                    backgroundColor: '#ebebeb', // สีพื้นหลังแถบ
                    '& .MuiLinearProgress-bar': {
                        borderRadius: 5,
                        background: `linear-gradient(90deg, ${primaryColor} 0%, #4facfe 100%)`, // Gradient ตาม AppBar
                    },
                }}
            />
        </Box>
    );
};

export default ProgressBarSection;