import { Box, Step, StepLabel, Stepper } from "@mui/material";

const ProgressBarSection = ({
    activeStep,
    totalSteps,
    primaryColor,
    sx
}) => {
    return (
        <Box
            sx={{
                justifyContent: "center",
                backgroundColor: "white",
                width: {
                    xs: "90%",
                    sm: "80%",
                    md: "80%",
                    lg: "60%",
                },
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: 3,
                mt: 4,
                ...sx,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    borderBottom: "1px solid #e0e0e0",
                    px: 2,
                    py: 3,
                }}
            >
                <Stepper
                    activeStep={activeStep}
                    alternativeLabel
                    sx={{
                        width: "100%",
                        "& .MuiStepConnector-line": {
                            borderColor: "#e0e0e0",
                            borderTopWidth: 2,
                        },
                    }}
                >
                    {[...Array(totalSteps).keys()].map((step) => (
                        <Step key={step}>
                            <StepLabel
                                StepIconProps={{
                                    sx: {
                                        color: step === activeStep ? primaryColor : "#cfd8dc", // default สีเทาอ่อน
                                        fontSize: 32,
                                    },
                                }}
                                sx={{
                                    "& .MuiStepLabel-label": {
                                        fontSize: 13,
                                        fontWeight: step === activeStep ? "bold" : "normal",
                                        mt: 1,
                                    },
                                }}
                            ></StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>
        </Box>
    );
};

export default ProgressBarSection;
