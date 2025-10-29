import { EditNote, Info } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import QuestionSurvey from "./QuestionSurvey";
import { useEffect } from "react";

const SectionSurvey = ({
    section,
    conditions,
    primaryColor,
    secondColor,
    onNext,
    onBack,
    onSubmit,
    is_last_section = false,
    onChangeAnswer,
    answers,
}) => {
    // const handleChangeAnswer = (questionId, newAnswer) => {
    //     onChangeAnswer(questionId, newAnswer);
    // };

    const handleChangeAnswer = (questionId, newAnswer) => {
        const question = section.questions.find((q) => q.id === questionId);

        // ถ้าเป็นคำถาม single choice (question_type_id === 3)
        if (question?.question_type_id === 3) {
            // ตัวเลือกที่เลือกไว้
            const selectedOptionId = Array.isArray(newAnswer)
                ? newAnswer[0]?.answer_option_id
                : newAnswer?.answer_option_id;

            // หา option เดิมที่เคยตอบ (ก่อนเปลี่ยน)
            const oldAnswer = answers.find((ans) => ans.question_id === questionId);
            const oldOptionId = oldAnswer?.answer_option_id;

            // ถ้ามีการเปลี่ยนตัวเลือก
            if (oldOptionId && oldOptionId !== selectedOptionId) {
                // ลบคำตอบของคำถามที่เคยแสดงเพราะ option เดิม
                const oldConditions = question.options.find((o) => o.id === oldOptionId)?.conditions || [];
                const targetQuestionIdsToRemove = oldConditions
                    .filter((c) => c.condition_type === "require_question")
                    .map((c) => c.target_question_id);

                if (targetQuestionIdsToRemove.length > 0) {
                    onChangeAnswer("__REMOVE__", targetQuestionIdsToRemove);
                }
            }
        }

        // อัปเดตคำตอบใหม่
        onChangeAnswer(questionId, newAnswer);
    };

    const shouldShowQuestion = (question) => {
        // หาว่ามีใคร require คำถามนี้บ้าง
        const requireConditions = section.questions.flatMap((q) =>
            q.options.flatMap((opt) =>
                opt.conditions
                    .filter(
                        (cond) =>
                            cond.condition_type === "require_question" &&
                            cond.target_question_id === question.id
                    )
                    .map((cond) => ({
                        sourceQuestionId: q.id,
                        sourceOptionId: opt.id,
                    }))
            )
        );

        if (requireConditions.length === 0) {
            // ถ้าไม่มีใคร require -> แสดงได้เลย
            return true;
        }

        // ถ้ามีคน require -> แสดงเมื่อ option ที่ require ถูกเลือก
        return requireConditions.some((cond) =>
            answers.some(
                (ans) =>
                    ans?.question_id === cond.sourceQuestionId &&
                    ans?.answer_option_id === cond.sourceOptionId
            )
        );
    };

    const checkNextDisabled = () => {
        return section.questions.some((q) => {
            // ตรวจเฉพาะคำถามที่บังคับและ "แสดงจริง ๆ"
            if (!q.is_required) return false;

            const visible = shouldShowQuestion(q);
            if (!visible) return false; // ❗ ถ้าไม่แสดง ไม่ต้องบังคับตอบ

            // หาคำตอบของคำถามนี้
            const ans = answers.find((a) => a.question_id === q.id);
            if (!ans) return true; // ยังไม่มีคำตอบเลย

            // ตรวจสอบว่ามีข้อมูลไหม
            const hasValue = ans.answer_value !== null && ans.answer_value !== undefined;
            const hasText = ans.answer_text && ans.answer_text.trim() !== "";
            const hasOption = ans.answer_option_id !== null && ans.answer_option_id !== undefined;
            const hasAttachment = ans.attachment_url && ans.attachment_url !== "";

            return !(hasValue || hasText || hasOption || hasAttachment);
        });
    };

    return (
        <>
            <Box
                sx={{
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
                }}
                key={section.id}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        p: 2,
                        backgroundImage: `linear-gradient(to left, ${primaryColor ?? "#2196f3"
                            }, ${secondColor ?? "#f5f5f5"})`,
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 20,
                        }}
                    >
                        {section.section_title}
                    </Typography>
                </Box>

                {section.is_dynamic && (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            position: "relative",
                            gap: 2,
                            p: 2,
                            px: 4,
                            borderRadius: 3,
                            background: `linear-gradient(135deg, ${lighten(
                                primaryColor,
                                0.85
                            )}, ${lighten(primaryColor, 0.95)})`,
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
                            my: 2,
                            mx: {
                                xs: 2, // หน้าจอเล็ก
                                sm: 2, // หน้าจอกลาง
                                md: 4, // หน้าจอใหญ่
                                lg: 4, // หน้าจอใหญ่มาก
                            },
                        }}
                    >
                        <Box
                            sx={{
                                backgroundColor: primaryColor,
                                color: "#fff",
                                borderRadius: "50%",
                                p: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height: 40,
                                width: 40,
                            }}
                        >
                            <EditNote sx={{ fontSize: 30 }} />
                        </Box>
                        <Typography
                            sx={{
                                fontSize: 16,
                                color: primaryColor,
                                fontWeight: "bold",
                            }}
                        >
                            {/* แสดงข้อความ dynamic_text ถ้ามี + คำตอบจาก dynamic_source_question_id */}
                        </Typography>
                    </Box>
                )}

                {section.section_note && (
                    <Box
                        sx={{
                            mx: { xs: 2, sm: 2, md: 4, lg: 4 },
                            mt: 2,
                            px: 2,
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 1.5,
                        }}
                    >
                        <Info
                            sx={{
                                color: lighten(primaryColor, 0.4),
                                fontSize: 20,
                                mt: "2px",
                            }}
                        />
                        <Typography
                            sx={{
                                fontSize: 16,
                                fontStyle: "italic",
                                color: "#555",
                            }}
                        >
                            {section.section_note}
                        </Typography>
                    </Box>
                )}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        m: {
                            xs: 2, // หน้าจอเล็ก
                            sm: 2, // หน้าจอกลาง
                            md: 4, // หน้าจอใหญ่
                            lg: 6, // หน้าจอใหญ่มาก
                        },
                    }}
                >
                    {section.questions.map((question, index) => {
                        const visible = shouldShowQuestion(question);
                        if (!visible) return null;

                        return (
                            <Box key={question.id}>
                                {/* Render คำถามที่นี่ */}
                                <QuestionSurvey
                                    question={question}
                                    answers={answers}
                                    primaryColor={primaryColor}
                                    secondColor={secondColor}
                                    onChange={(updatedQuestion) => {
                                        // Handle when answer question changes
                                        handleChangeAnswer(
                                            updatedQuestion.id,
                                            updatedQuestion.answer
                                        );
                                    }}
                                />
                            </Box>
                        );
                    })}
                </Box>
            </Box>
            {/* Render ปุ่มถัดไป */}

            <Box
                sx={{
                    justifyContent: "center",
                    width: {
                        xs: "90%", // หน้าจอเล็ก
                        sm: "80%", // หน้าจอกลาง
                        md: "80%", // หน้าจอใหญ่
                        lg: "60%", // หน้าจอใหญ่มาก
                    },
                    height: "auto",
                    overflow: "hidden",
                    gap: 2,
                    mt: 1,
                }}
                key={`footer-${section.id}`}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent:
                            section.section_no > 1 ? "space-between" : "flex-end", // ปุ่มย้อนกลับซ้าย ถัดไปขวา
                        mb: 2,
                    }}
                >
                    {section.section_no > 1 && onBack && (
                        <Button
                            sx={{
                                minWidth: 100,
                                borderRadius: 3,
                            }}
                            variant="outlined"
                            color="primary"
                            onClick={onBack}
                        >
                            ย้อนกลับ
                        </Button>
                    )}
                    {/* ปุ่มถัดไป หรือส่งแบบสอบถาม */}
                    {!is_last_section && onNext && (
                        <Button
                            sx={{
                                minWidth: 100,
                                borderRadius: 3,
                                color: "white",
                                fontWeight: "bold",
                            }}
                            // ปุ่มถัดไป ปิดใช้งานถ้ายังมีคำถามที่โดน is_required ที่ยังไม่ได้ตอบ
                            disabled={checkNextDisabled()}
                            variant="contained"
                            color="primary"
                            onClick={onNext}
                        >
                            ถัดไป
                        </Button>
                    )}
                    {/* ปุ่มส่งแบบสอบถาม */}
                    {is_last_section && onSubmit && (
                        <Button
                            sx={{
                                minWidth: 100,
                                borderRadius: 3,
                                color: "white",
                                fontWeight: "bold",
                            }}
                            variant="contained"
                            color="primary"
                            onClick={onSubmit}
                            disabled={checkNextDisabled()}
                        >
                            ส่งแบบสอบถาม
                        </Button>
                    )}
                </Box>
            </Box>
        </>
    );
};

export default SectionSurvey;
