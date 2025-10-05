"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import useApi from "../../../services";
import { AppBar, Box, createTheme, Divider, ThemeProvider, Toolbar, Typography } from "@mui/material";
import Head from "next/head";
import ProgressBarSection from "../../../components/surveys/ProgressBarSection";
import SectionSurvey from "../../../components/surveys/SectionSurvey";

const SurveysPage = () => {
    const { id } = useParams();
    const [survey, setSurvey] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeStep, setActiveStep] = useState(0);
    const [answers, setAnswers] = useState([]); // เก็บคำตอบของผู้ใช้

    // Fetch survey data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await useApi.surveys.getSurveyById(id);
                setSurvey(response.data);
            } catch (error) {
                console.error("Error fetching survey data:", error);
            }
        };

        if (id) fetchData();
    }, [id]);

    // Set body background color when survey loads
    useEffect(() => {
        if (survey?.second_color) {
            document.body.style.backgroundColor = survey.second_color;
        }

        return () => {
            // Reset background on unmount
            document.body.style.backgroundColor = null;
        };
    }, [survey?.second_color]);

    if (!survey) return null; // หรือใส่ loading spinner

    return (
        <>
            <Head>
                <title>{survey.title || "Survey"}</title>
                <meta name="description" content={survey.description || "แบบสอบถามออนไลน์"} />
                <meta name="theme-color" content={survey.primary_color || "#1976d2"} />
            </Head>

            <ThemeProvider
                theme={createTheme({
                    typography: {
                        fontFamily: survey?.font_type || "Sarabun, sans-serif"
                    },
                })}
            >
                <Box
                    sx={{
                        backgroundImage: survey.background_image ? `url(${survey.background_image})` : "none",
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
                            totalSteps={survey.sections.length}
                            primaryColor={survey.primary_color || "#1976d2"}
                        />
                        {/* ส่วนของคำถาม จะมาแทนที่ตรงนี้ */}
                        {survey.sections.length > 0 && (
                            <SectionSurvey
                                section={survey.sections[activeStep]}
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
                                onChangeAnswer={(questionId, answer) => {
                                    setAnswers(prev => {
                                        const updatedAnswers = [...prev];
                                        updatedAnswers[questionId] = answer;
                                        return updatedAnswers;
                                    });
                                }}
                                answers={answers}
                            />
                        )
                        }
                    </Box>
                </Box>
            </ThemeProvider>
        </>
    );
};

export default SurveysPage;
