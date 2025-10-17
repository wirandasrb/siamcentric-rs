"use client";
import React, { useEffect, useMemo, useState } from "react";
import { AppBar, Box, createTheme, CssBaseline, Divider, ThemeProvider, Toolbar, Typography, useTheme } from "@mui/material";
import ProgressBarSection from "./ProgressBarSection";
import SectionSurvey from "./SectionSurvey";
import ThankMessage from "./ThankMessage";
import ModalConfirm from "../modals/ModalComfirm";

const SurveyComponent = ({ survey, responses }) => {
    const customTheme = useMemo(
        () =>
            createTheme({
                typography: {
                    fontFamily: survey?.font_type || "Sarabun, sans-serif",
                },
                palette: {
                    primary: { main: survey?.primary_color || "#1976d2" },
                    secondary: { main: survey?.second_color || "#f5f5f5" },
                },
            }),
        [survey]
    );
    const [activeStep, setActiveStep] = useState(0);
    const [answers, setAnswers] = useState(responses || []);
    const [conditionMap, setConditionMap] = useState({}); // เก็บเงื่อนไขของคำถาม
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    useEffect(() => {
        if (survey && survey.sections) {
            // สร้างแผนที่เงื่อนไขของคำถาม
            const map = {};
            survey.sections.forEach(section => {
                section.questions.forEach(question => {
                    if (question.options) {
                        question.options.forEach(option => {
                            if (option.is_have_condition && option.conditions) {
                                map[option.id] = option.conditions;
                            }
                        });
                    }
                });
            });
            setConditionMap(map);
        }
    }, [survey]);

    const handleSubmit = async () => {
        // Logic การส่งคำตอบเมื่อแบบสำรวจเสร็จสิ้น
        console.log("Submitting answers:", answers);
        setActiveStep(prev => prev + 1);
        setIsConfirmOpen(false);

        // คุณสามารถเพิ่มโค้ดเพื่อส่งคำตอบไปยังเซิร์ฟเวอร์ได้ที่นี่
    }

    const handleRetakeSurvey = () => {
        setAnswers([]);
        setActiveStep(0);
    }

    return (
        <ThemeProvider theme={customTheme} >
            <CssBaseline />
            <Box
                sx={{
                    backgroundColor: customTheme.palette.secondary.main,
                    backgroundImage: survey.background_image
                        ? `url(${survey.background_image})`
                        : "none",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    minHeight: "100vh",
                    width: "100%",
                    display: "flex",              // ✅ ให้ Flex ทั้งหน้า
                    flexDirection: "column",
                }}
            >
                <AppBar
                    position="static"
                    sx={{ backgroundColor: survey.primary_color || "#1976d2" }}
                >
                    <Toolbar>
                        <Box
                            component="img"
                            src={survey.image_url ?? "/images/online-survey.png"}
                            sx={{ width: 60, height: 60, padding: 1 }}
                        />
                    </Toolbar>
                </AppBar>

                {/* เนื้อหาตรงกลาง */}
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column", // ✅ เรียงจากบนลงล่าง
                        alignItems: "center",
                        justifyContent: "flex-start", // หรือ "center" ถ้าอยากให้อยู่กลางแนวตั้ง
                        gap: 1, // เพิ่มระยะห่างระหว่างหัวข้อกับ progress bar
                        py: 4,  // padding ด้านบน/ล่าง
                    }}
                >
                    {/* กล่องหัวข้อ */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            backgroundColor: "white",
                            width: {
                                xs: "90%",
                                sm: "80%",
                                md: "80%",
                                lg: "60%",
                            },
                            height: "fit-content",
                            borderRadius: 2,
                            boxShadow: 3,
                            p: 2,
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                                justifyContent: "center",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: 24,
                                    fontWeight: "bold",
                                    color: survey?.primary_color,
                                    textAlign: "center",
                                }}
                            >
                                {survey.title}
                            </Typography>
                            <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                                {survey.description}
                            </Typography>
                            {survey.note && (
                                <Typography
                                    sx={{
                                        fontSize: 14,
                                        color: "red",
                                        fontStyle: "italic",
                                        ml: 2,
                                    }}
                                >
                                    ** หมายเหตุ: {survey.note}
                                </Typography>
                            )}
                            <Divider
                                sx={{
                                    width: "100%",
                                    borderBottomWidth: 2,
                                    borderColor: survey.primary_color,
                                }}
                            />
                        </Box>
                    </Box>

                    {/* Progress bar อยู่ใต้หัวข้อ */}
                    <ProgressBarSection
                        activeStep={activeStep}
                        totalSteps={survey?.sections?.length}
                        primaryColor={survey?.primary_color || "#1976d2"}
                    />
                    {/* ส่วนของคำถาม จะมาแทนที่ตรงนี้ */}
                    {survey?.sections?.length > 0 && activeStep < survey.sections.length && (
                        <SectionSurvey
                            section={survey.sections[activeStep]}
                            conditions={conditionMap}
                            primaryColor={survey.primary_color || "#1976d2"}
                            secondColor={survey.second_color || "#f5f5f5"}
                            onNext={() => {
                                if (activeStep < survey.sections.length - 1) {
                                    setActiveStep(activeStep + 1);
                                }
                            }}
                            onBack={() => {
                                if (activeStep > 0) {
                                    setActiveStep(activeStep - 1);
                                }
                            }}
                            onSubmit={() => setIsConfirmOpen(true)}
                            is_last_section={activeStep === survey.sections.length - 1}
                            onChangeAnswer={(questionId, answer) => {
                                setAnswers(prev => {
                                    const updatedAnswers = [...prev];
                                    updatedAnswers[questionId] = answer;
                                    return updatedAnswers;
                                });
                            }}
                            answers={answers}
                        />
                    )}

                    {/* ส่วนท้ายแบบขอบคุณหลังส่งแบบสอบถามเสร็จสิ้น */}
                    {activeStep >= survey?.sections?.length && (
                        <ThankMessage form={survey} onRetakeSurvey={handleRetakeSurvey} />
                    )}
                </Box>
            </Box>
            <ModalConfirm
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleSubmit}
                title="ยืนยันส่งคำตอบ"
                description="คุณแน่ใจหรือว่าต้องการส่งคำตอบแบบสอบถามนี้?"
            />
        </ThemeProvider>
    );
}

export default SurveyComponent;