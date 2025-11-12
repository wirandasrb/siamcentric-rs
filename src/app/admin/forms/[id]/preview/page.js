"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import useApi from "../../../../../services";
import { AppBar, Box, Button, CircularProgress, colors, createTheme, CssBaseline, Divider, IconButton, ThemeProvider, Typography } from "@mui/material";
import { ArrowBackIos } from "@mui/icons-material";
import ProgressBarSection from "../../../../../components/surveys/ProgressBarSection";
import SectionSurvey from "../../../../../components/surveys/SectionSurvey";
import ThankMessage from "../../../../../components/surveys/ThankMessage";

const FormPreviewPage = () => {
    const { id } = useParams();
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeStep, setActiveStep] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [conditionMap, setConditionMap] = useState({});

    const router = useRouter();

    useEffect(() => {
        fetchData(id);
    }, [id]);

    const fetchData = async (form_id) => {
        try {
            const response = await useApi.forms.getFormById(form_id);
            setForm(response.data);
        } catch (error) {
            console.error("Error fetching form data:", error);
        } finally {
            setLoading(false);
        }
    }

    const customTheme = useMemo(() => {
        return createTheme({
            palette: {
                primary: {
                    main: form?.primary_color || "#1976d2",
                },
                secondary: {
                    main: form?.second_color || "#f5f5f5",
                },
            },
            typography: {
                fontFamily: form?.font_type || "Sarabun, sans-serif",
            },
        });
    }, [form]);

    useEffect(() => {
        if (form && form.sections) {
            // สร้างแผนที่เงื่อนไขของคำถาม
            const map = {};
            form?.sections.forEach((section) => {
                section.questions.forEach((question) => {
                    if (question.options) {
                        question.options.forEach((option) => {
                            if (option.is_have_condition && option.conditions) {
                                map[option.id] = option.conditions;
                            }
                        });
                    }
                });
            });
            setConditionMap(map);
        }
    }, [form]);

    const handleChangeAnswer = (questionId, newAnswer) => {
        setAnswers((prev) => {
            // กรณีลบคำตอบของคำถามตาม condition
            if (questionId === "__REMOVE__" && Array.isArray(newAnswer)) {
                return prev.filter((ans) => !newAnswer.includes(ans.question_id));
            }

            const otherAnswers = prev.filter(
                (ans) => ans?.question_id !== questionId
            );

            // สำหรับ matrix question, newAnswer อาจเป็น array
            const newAnswers = Array.isArray(newAnswer) ? newAnswer : [newAnswer];

            return [...otherAnswers, ...newAnswers];
        });
    };

    if (loading) {
        return <Box
            sx={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
            }}>
            <CircularProgress />
            กำลังโหลดแบบฟอร์ม...
        </Box>;
    }



    return (
        <ThemeProvider theme={customTheme}>
            <CssBaseline />
            <Box sx={{
                backgroundColor: form?.second_color || "#f5f5f5",
                backgroundImage: form?.background_image ? `url(${form.background_image})` : 'none',
                backgroundSize: 'cover',
                minHeight: '100vh',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',

            }}
            >
                <AppBar position="static"
                    sx={{
                        backgroundColor: "#e3f2fd",
                    }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            padding: 1,
                        }}
                    >
                        <IconButton>
                            <ArrowBackIos
                                sx={{ color: colors.grey[800] }}
                                onClick={() => router.push(`/admin/forms/${id}`)}
                            />
                        </IconButton>
                        <Typography sx={{
                            color: colors.grey[800],
                            fontSize: 18,
                        }}>
                            โหมดแสดงตัวอย่างแบบฟอร์ม
                        </Typography>
                    </Box>
                </AppBar>
                <AppBar position="static" color="primary">
                    <Box
                        component="img"
                        src={form?.image_url ?? "/images/online-survey.png"}
                        sx={{ width: 60, height: 60, padding: 1 }}
                    />
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
                        py: 4, // padding ด้านบน/ล่าง
                    }}
                >
                    {/* กล่องหัวข้อ */}
                    {(form?.display_title === "all_pages" ||
                        (form?.display_title === "first_page" && activeStep === 0)) &&
                        (<Box
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
                                        color: form?.primary_color,
                                        textAlign: "center",
                                    }}
                                >
                                    {form?.title}
                                </Typography>
                                <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                                    {form.description}
                                </Typography>
                                {form.note && (
                                    <Typography
                                        sx={{
                                            fontSize: 14,
                                            color: "red",
                                            fontStyle: "italic",
                                            ml: 2,
                                        }}
                                    >
                                        ** หมายเหตุ: {form.note}
                                    </Typography>
                                )}
                                <Divider
                                    sx={{
                                        width: "100%",
                                        borderBottomWidth: 2,
                                        borderColor: form.primary_color,
                                    }}
                                />
                            </Box>
                        </Box>
                        )}

                    {/* Progress Bar */}
                    {form?.sections?.length > 1 &&
                        activeStep < form.sections?.length && (
                            <ProgressBarSection
                                activeStep={activeStep}
                                totalSteps={form?.sections?.length}
                                primaryColor={form?.primary_color}
                            />
                        )}

                    {/* ส่วนของแบบฟอร์ม */}
                    {form && form?.sections && form?.sections?.length > 0 && activeStep < form?.sections?.length && (
                        <SectionSurvey
                            sections={form.sections}
                            section={form.sections[activeStep]}
                            answers={answers || []}
                            primaryColor={form?.primary_color}
                            secondColor={form?.second_color}
                            onNext={() => {
                                if (activeStep < form.sections.length - 1) {
                                    setActiveStep(activeStep + 1);
                                }
                            }}
                            onBack={() => {
                                if (activeStep > 0) {
                                    setActiveStep(activeStep - 1);
                                }
                            }}
                            onSubmit={
                                () => {
                                    setActiveStep(activeStep + 1);
                                }
                            }
                            is_last_section={activeStep === form?.sections?.length - 1}
                            onChangeAnswer={handleChangeAnswer}
                            isPreview={true}

                        />
                    )}

                    {/* ส่วนท้ายแบบขอบคุณหลังส่งแบบสอบถามเสร็จสิ้น */}
                    {activeStep >= form?.sections?.length && (
                        <ThankMessage
                            form={form}
                            onRetakeSurvey={
                                () => {
                                    setActiveStep(0);
                                    setAnswers([]);
                                }
                            }
                        />
                    )}
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default FormPreviewPage;