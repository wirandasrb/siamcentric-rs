"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  AppBar,
  Box,
  createTheme,
  CssBaseline,
  Divider,
  ThemeProvider,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import ProgressBarSection from "./ProgressBarSection";
import SectionSurvey from "./SectionSurvey";
import ThankMessage from "./ThankMessage";
import ModalConfirm from "../modals/ModalComfirm";
import useApi from "../../services";

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
  const [respondentToken, setRespondentToken] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState(responses || []);
  const [conditionMap, setConditionMap] = useState({}); // เก็บเงื่อนไขของคำถาม
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    // ตรวจสอบถ้ามี responses และมี respondent_token
    const token = localStorage.getItem("respondent_token");
    if (token) {
      setRespondentToken(token);
    }
  }, []);

  useEffect(() => {
    if (survey && survey.sections) {
      // สร้างแผนที่เงื่อนไขของคำถาม
      const map = {};
      survey.sections.forEach((section) => {
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
  }, [survey]);

  // check token and this token has submitted this survey before
  useEffect(() => {
    const checkPreviousSubmission = async () => {
      try {
        const response = await useApi.surveys.checkResponseToken(
          survey.id,
          respondentToken
        );
        console.log("Check previous submission response:", response);
        if (response.status === "success" && response.alreadyAnswered) {
          // ไปหน้าท้ายเลย
          setActiveStep(survey?.sections.length);
        } else {
          // ยังไม่เคยส่ง ให้เริ่มต้นที่หน้าแรก
          setActiveStep(0);
        }
      } catch (error) {
        console.error("Error checking previous submission:", error);
        setActiveStep(0);
      }
    }
    if (survey && survey?.id && respondentToken) {
      checkPreviousSubmission();
    } else if (survey && survey?.id && !respondentToken) {
      setActiveStep(0);
    }
  }, [respondentToken, survey]);

  const handleSubmit = async () => {
    setIsConfirmOpen(false);
    try {
      const response = await useApi.surveys.submitSurveyAnswers({
        answers: answers,
        form_id: survey.id,
        respondent_token: "",
      });

      console.log("Survey submission response:", response);
      if (response.success) {
        const token = response.respondent_token;
        if (typeof window !== "undefined" && token) {
          const existingToken = localStorage.getItem("respondent_token");
          if (!existingToken) {
            localStorage.setItem("respondent_token", token);
            setRespondentToken(token);
          }
        }
        setActiveStep((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error submitting survey answers:", error);
    }

    // คุณสามารถเพิ่มโค้ดเพื่อส่งคำตอบไปยังเซิร์ฟเวอร์ได้ที่นี่
  };

  const handleRetakeSurvey = () => {
    setAnswers([]);
    setActiveStep(0);
    if (typeof window !== "undefined") {
      localStorage.removeItem("respondent_token");
      setRespondentToken(null);
    }
  };

  const handleChangeAnswer = (questionId, newAnswer) => {
    setAnswers((prev) => {
      // กรณีลบคำตอบของคำถามตาม condition
      if (questionId === "__REMOVE__" && Array.isArray(newAnswer)) {
        return prev.filter((ans) => !newAnswer.includes(ans.question_id));
      }

      // // ปกติ (รวมถึง matrix logic)
      // let otherAnswers = [];

      // if (Array.isArray(newAnswer)) {
      //   const rowIds = newAnswer.map((a) => a.matrix_row_id);
      //   otherAnswers = prev.filter(
      //     (ans) =>
      //       ans.question_id !== questionId ||
      //       (ans.question_id === questionId && !rowIds.includes(ans.matrix_row_id))
      //   );
      // } else {
      //   otherAnswers = prev.filter(
      //     (ans) =>
      //       ans.question_id !== questionId ||
      //       (ans.matrix_row_id &&
      //         newAnswer.matrix_row_id &&
      //         ans.matrix_row_id !== newAnswer.matrix_row_id)
      //   );
      // }

      const otherAnswers = prev.filter(
        (ans) => ans?.question_id !== questionId
      );

      // สำหรับ matrix question, newAnswer อาจเป็น array
      const newAnswers = Array.isArray(newAnswer) ? newAnswer : [newAnswer];

      return [...otherAnswers, ...newAnswers];
    });
  };

  const skipSectionByConditions = () => {
    let skipToSectionIndex = null;

    answers.forEach((answer) => {
      const question = survey.sections
        .flatMap((s) => s.questions)
        .find((q) => q.id === answer.question_id);

      if (question && question.options) {
        const option = question.options.find(
          (o) => o.id === answer.answer_option_id
        );

        if (option && option.is_have_condition && option.conditions) {
          option.conditions.forEach((condition) => {
            if (condition.condition_type === "skip_section") {
              const targetIndex = survey.sections.findIndex(
                (s) => s.id === condition.target_section_id
              );

              if (targetIndex !== -1) {
                if (skipToSectionIndex === null || targetIndex > skipToSectionIndex) {
                  skipToSectionIndex = targetIndex;
                }
              }
            }
          });
        }
      }
    });

    return skipToSectionIndex;
  };

  // console.log("SurveyComponent render with answers:", answers);

  return (
    <ThemeProvider theme={customTheme}>
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
          display: "flex", // ✅ ให้ Flex ทั้งหน้า
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
            py: 4, // padding ด้านบน/ล่าง
          }}
        >
          {/* กล่องหัวข้อ */}
          {(survey?.display_title === "all_pages" ||
            (survey?.display_title === "first_page" && activeStep === 0)) &&
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
            </Box>)}

          {/* Progress bar อยู่ใต้หัวข้อ */}
          {survey?.sections?.length > 1 && activeStep < survey.sections?.length && (
            <ProgressBarSection
              activeStep={activeStep}
              totalSteps={survey?.sections?.length}
              primaryColor={survey?.primary_color || "#1976d2"}
            />
          )}
          {/* ส่วนของคำถาม จะมาแทนที่ตรงนี้ */}
          {survey?.sections?.length > 0 &&
            activeStep < survey.sections.length && (
              <SectionSurvey
                sections={survey.sections}
                section={survey.sections[activeStep]}
                conditions={conditionMap}
                primaryColor={survey.primary_color || "#1976d2"}
                secondColor={survey.second_color || "#f5f5f5"}
                onNext={() => {
                  const skipToIndex = skipSectionByConditions();
                  // console.log("Determined skip to section index:", skipToIndex);
                  if (skipToIndex !== null) {
                    setActiveStep(skipToIndex);
                  } else {
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
                onChangeAnswer={handleChangeAnswer}
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
};

export default SurveyComponent;
