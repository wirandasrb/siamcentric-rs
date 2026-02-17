import {
  ChatBubbleOutline,
  CheckCircle,
  CheckCircleOutline,
  CheckCircleOutlined,
  DescriptionOutlined,
  EditNote,
  EditNoteOutlined,
  GppGoodOutlined,
  HomeRepairService,
  HomeRepairServiceOutlined,
  Info,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Person,
  PersonOutline,
  SendOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  lighten,
  Paper,
  Typography,
} from "@mui/material";
import QuestionSurvey from "./QuestionSurvey";
import React, { useEffect } from "react";

const iconTitle = [
  <PersonOutline key="icon-person" />,
  <HomeRepairServiceOutlined key="icon-home-repair" />,
  <DescriptionOutlined key="icon-description" />,
  <CheckCircleOutlined key="icon-check-circle" />,
  <GppGoodOutlined key="icon-gpp-good" />,
  <ChatBubbleOutline key="icon-chat-bubble" />,
  <EditNoteOutlined key="icon-edit-note" />,
];

const SectionSurvey = ({
  sections,
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
  isPreview = false,
}) => {
  useEffect(() => {
    // เมื่อ section เปลี่ยน (เช่น จากหน้า 1 ไป 2)
    // ให้เลื่อนหน้าจอขึ้นไปบนสุด
    window.scrollTo({
      top: 0,
      behavior: "smooth", // 'smooth' จะค่อยๆ เลื่อน, 'instant' จะเด้งขึ้นทันที
    });
  }, [section.id, section.section_no]);
  // const handleChangeAnswer = (questionId, newAnswer) => {
  //     onChangeAnswer(questionId, newAnswer);
  // };

  //   const handleChangeAnswer = (questionId, newAnswer) => {
  //     const question = section.questions.find((q) => q.id === questionId);

  //     // ถ้าเป็นคำถาม single choice (question_type_id === 3)
  //     if (question?.question_type_id === 3) {
  //       // ตัวเลือกที่เลือกไว้
  //       const selectedOptionId = Array.isArray(newAnswer)
  //         ? newAnswer[0]?.answer_option_id
  //         : newAnswer?.answer_option_id;

  //       // หา option เดิมที่เคยตอบ (ก่อนเปลี่ยน)
  //       const oldAnswer = answers.find((ans) => ans.question_id === questionId);
  //       const oldOptionId = oldAnswer?.answer_option_id;

  //       // ถ้ามีการเปลี่ยนตัวเลือก
  //       if (oldOptionId && oldOptionId !== selectedOptionId) {
  //         // ลบคำตอบของคำถามที่เคยแสดงเพราะ option เดิม
  //         const oldConditions =
  //           question.options.find((o) => o.id === oldOptionId)?.conditions || [];
  //         const targetQuestionIdsToRemove = oldConditions
  //           .filter((c) => c.condition_type === "require_question")
  //           .map((c) => c.target_question_id);

  //         if (targetQuestionIdsToRemove.length > 0) {
  //           onChangeAnswer("__REMOVE__", targetQuestionIdsToRemove);
  //         }
  //       }
  //     }

  //     // อัปเดตคำตอบใหม่
  //     onChangeAnswer(questionId, newAnswer);
  //   };
  const handleChangeAnswer = (questionId, newAnswer) => {
    // ฟังก์ชันหาข้อที่จะโดนผลกระทบ (โดนซ่อน) เพื่อเอาไปล้างคำตอบ
    const findDependentIds = (qId) => {
      let ids = [];
      sections.forEach((s) => {
        s.questions.forEach((q) => {
          q.options.forEach((opt) => {
            (opt.conditions || []).forEach((cond) => {
              // ถ้าข้อ qId เป็นต้นทางของเงื่อนไขใดๆ ในข้ออื่น
              if (Number(q.id) === Number(qId)) {
                ids.push(cond.target_question_id);
                // วิ่งหาชั้นถัดไป (Recursive)
                ids = [...ids, ...findDependentIds(cond.target_question_id)];
              }
            });
          });
        });
      });
      return [...new Set(ids)]; // คืนค่าเฉพาะ ID ที่ไม่ซ้ำ
    };

    // 1. หาข้อคำถามลูกที่ต้องถูกล้างคำตอบ
    // เราหาล่วงหน้าเลยว่าการเปลี่ยนคำตอบที่ข้อนี้ จะส่งผลกระทบถึงข้อไหนบ้างในสายสัมพันธ์
    const idsToClear = findDependentIds(questionId);

    if (idsToClear.length > 0) {
      onChangeAnswer("__REMOVE__", idsToClear);
    }

    // 2. อัปเดตคำตอบใหม่ของข้อที่ User กำลังคลิก
    onChangeAnswer(questionId, newAnswer);
  };

  const shouldShowQuestion = (question) => {
    // --- 1) เช็ค Skip Condition ---
    const skipConditions = sections.flatMap((s) =>
      s.questions.flatMap((q) =>
        q.options.flatMap((opt) =>
          (opt.conditions || [])
            .filter(
              (cond) =>
                cond.condition_type === "skip_question" &&
                cond.target_question_id === question.id
            )
            .map((cond) => ({
              sourceQuestionId: q.id,
              skipOptionId: cond.required_option_id || opt.id,
            }))
        )
      )
    );

    for (let skipCond of skipConditions) {
      // เช็คว่าข้อที่เป็นต้นทางของ Skip นั้น "แสดงอยู่" ไหท
      const sourceQuestion = sections
        .flatMap((s) => s.questions)
        .find((q) => q.id === skipCond.sourceQuestionId);
      if (sourceQuestion && !shouldShowQuestion(sourceQuestion)) continue;

      const ans = answers.find(
        (a) => a.question_id === skipCond.sourceQuestionId
      );
      if (ans) {
        const optIds = Array.isArray(ans.answer_option_id)
          ? ans.answer_option_id
          : [ans.answer_option_id];
        if (optIds.some((id) => Number(id) === Number(skipCond.skipOptionId)))
          return false;
      }
    }

    // 2) เช็ค Require Condition ---
    const requireConditions = sections.flatMap((s) =>
      s.questions.flatMap((q) =>
        q.options.flatMap((opt) =>
          (opt.conditions || [])
            .filter(
              (cond) =>
                cond.condition_type === "require_question" &&
                Number(cond.target_question_id) === Number(question.id)
            )
            .map((cond) => ({
              sourceQuestionId: q.id,
              requiredOptionId: cond.required_option_id || opt.id,
            }))
        )
      )
    );

    if (!requireConditions.length) return true;

    // เช็คว่ามี Source ข้อไหนที่ "แสดงอยู่" และ "ตอบตรงเงื่อนไข" บ้าง
    return requireConditions.some((cond) => {
      // เช็คว่าข้อต้นทางถูกซ่อนอยู่หรือไม่ (ถ้าต้นทางซ่อน ตัวมันเองต้องซ่อนตาม)
      const sourceQuestion = sections
        .flatMap((s) => s.questions)
        .find((q) => q.id === cond.sourceQuestionId);
      if (sourceQuestion && !shouldShowQuestion(sourceQuestion)) return false;

      const ans = answers.find(
        (a) => Number(a.question_id) === Number(cond.sourceQuestionId)
      );
      if (!ans) return false;

      const optIds = Array.isArray(ans.answer_option_id)
        ? ans.answer_option_id
        : [ans.answer_option_id];
      return optIds.some((id) => Number(id) === Number(cond.requiredOptionId));
    });
  };

  //   const shouldShowQuestion = (question) => {
  //     // 1) เช็ค skip ก่อนเสมอ
  //     const skipConditions = sections.flatMap((s) =>
  //       s.questions.flatMap((q) =>
  //         q.options.flatMap((opt) =>
  //           (opt.conditions || [])
  //             .filter(
  //               (cond) =>
  //                 cond.condition_type === "skip_question" &&
  //                 cond.target_question_id === question.id
  //             )
  //             .map((cond) => ({
  //               sourceQuestionId: q.id,
  //               skipOptionId: cond.required_option_id || opt.id,
  //             }))
  //         )
  //       )
  //     );

  //     for (let skipCond of skipConditions) {
  //       const isSkipped = answers.some(
  //         (ans) =>
  //           ans.question_id === skipCond.sourceQuestionId &&
  //           ans.answer_option_id === skipCond.skipOptionId
  //       );
  //       if (isSkipped) return false; // ❗ skip ต้อง win
  //     }

  //     // 2) หา require conditions
  //     const requireConditions = sections.flatMap((s) =>
  //       s.questions.flatMap((q) =>
  //         q.options.flatMap((opt) =>
  //           (opt.conditions || [])
  //             .filter(
  //               (cond) =>
  //                 cond.condition_type === "require_question" &&
  //                 Number(cond.target_question_id) === Number(question.id)
  //             )
  //             .map((cond) => ({
  //               sourceQuestionId: q.id,
  //               requiredOptionId: cond.required_option_id || opt.id,
  //             }))
  //         )
  //       )
  //     );

  //     // ไม่มี require → แสดงได้เลย
  //     if (!requireConditions.length) return true;

  //     // 3) เช็ค require แบบ OR
  //     // return requireConditions.some((cond) =>
  //     //   answers.some(
  //     //     (ans) =>
  //     //       Number(ans.question_id) === Number(cond.sourceQuestionId) &&
  //     //       Number(ans.answer_option_id) === Number(cond.requiredOptionId)
  //     //   )
  //     // );
  //     return requireConditions.some((cond) =>
  //       answers.some((ans) => {
  //         if (Number(ans.question_id) !== Number(cond.sourceQuestionId))
  //           return false;

  //         // ถ้าคำตอบมาเป็น Array (Multiple Choice)
  //         if (Array.isArray(ans.answer_option_id)) {
  //           return ans.answer_option_id.some(
  //             (id) => Number(id) === Number(cond.requiredOptionId)
  //           );
  //         }

  //         // ถ้าคำตอบมาเป็นค่าเดียว (Single Choice)
  //         return Number(ans.answer_option_id) === Number(cond.requiredOptionId);
  //       })
  //     );
  //   };

  const checkNextDisabled = () => {
    if (isPreview) return false;
    return section.questions.some((q) => {
      // ตรวจเฉพาะคำถามที่บังคับและ "แสดงจริง ๆ"
      if (!q.is_required) return false;

      const visible = shouldShowQuestion(q);
      if (!visible) return false; //ถ้าไม่แสดง ไม่ต้องบังคับตอบ

      // หาคำตอบของคำถามนี้
      const ans = answers.find((a) => a.question_id === q.id);
      if (!ans) return true; // ยังไม่มีคำตอบเลย

      // ตรวจสอบว่ามีข้อมูลไหม
      const hasValue =
        ans.answer_value !== null && ans.answer_value !== undefined;
      const hasText = ans.answer_text && ans.answer_text.trim() !== "";
      const hasOption =
        ans.answer_option_id !== null && ans.answer_option_id !== undefined;
      const hasAttachment = ans.attachment_url && ans.attachment_url !== "";

      // ถ้าตอบตัวเลือกที่เป็น is_other ต้องมีข้อความ
      const optionSelected = q.options.find(
        (o) => o.id === ans.answer_option_id
      );
      if (optionSelected?.is_other) {
        if (!hasText) return true;
      }

      // ถ้า matrix question ตอนนี้จะต้องตรวจสอบทุก row
      if (q.question_type_id === 9) {
        const matrixRows = q.matrix_rows || [];
        for (let row of matrixRows) {
          const rowAns = answers.find(
            (a) => a.question_id === q.id && a.matrix_row_id === row.id
          );
          if (!rowAns) return true; // row นี้ยังไม่มีคำตอบ
        }
      }

      return !(hasValue || hasText || hasOption || hasAttachment);
    });
  };

  const renderDynamicText = (dynamicText, sourceQuestionId) => {
    if (!sourceQuestionId) return dynamicText;

    // 1. หาคำตอบของคำถามหลัก (Source)
    const primaryAnswer = answers.find(
      (ans) => Number(ans.question_id) === Number(sourceQuestionId)
    );
    if (!primaryAnswer) return dynamicText;

    // 2. ค้นหาข้อมูลคำถามและ Option ที่ถูกเลือกเพื่อดูว่ามี Condition ไหม
    const allQuestions = sections.flatMap((s) => s.questions);
    const primaryQuestion = allQuestions.find(
      (q) => Number(q.id) === Number(sourceQuestionId)
    );

    let finalAnswer = primaryAnswer; // เริ่มต้นด้วยคำตอบหลัก
    let targetQuestion = primaryQuestion;

    if (primaryQuestion && primaryAnswer.answer_option_id) {
      const selectedOption = primaryQuestion.options.find(
        (opt) => Number(opt.id) === Number(primaryAnswer.answer_option_id)
      );

      // ✨ ตรวจสอบ Condition: ถ้า Option นี้มีเงื่อนไข "require_question"
      // ให้เปลี่ยนไปเอาคำตอบจากข้อ Target นั้นแทน
      const hasRequireCond = selectedOption?.conditions?.find(
        (c) => c.condition_type === "require_question"
      );

      if (hasRequireCond) {
        const followUpAnswer = answers.find(
          (ans) =>
            Number(ans.question_id) ===
            Number(hasRequireCond.target_question_id)
        );

        if (followUpAnswer) {
          finalAnswer = followUpAnswer;
          targetQuestion = allQuestions.find(
            (q) => Number(q.id) === Number(hasRequireCond.target_question_id)
          );
        }
      }
    }

    // 3. ดึงข้อความที่จะแสดงผลจาก finalAnswer และ targetQuestion
    let displayText = "";

    if (targetQuestion && finalAnswer) {
      // กรณีเป็น Single/Multiple Choice
      if (finalAnswer.answer_option_id) {
        const optionObj = targetQuestion.options.find(
          (opt) => Number(opt.id) === Number(finalAnswer.answer_option_id)
        );

        if (optionObj) {
          // ถ้าเป็น "อื่นๆ" ให้ดึง answer_text ถ้าไม่ใช่ดึงชื่อ option
          displayText = optionObj.is_other
            ? finalAnswer.answer_text || optionObj.option
            : optionObj.option;
        }
      }
      // กรณีเป็นคำถามปลายเปิด (Text/Input) ที่ไม่มี option_id
      else {
        displayText = finalAnswer.answer_text || finalAnswer.answer_value || "";
      }
    }

    // ล้างเลขหัวข้อออก (ถ้ามี เช่น "1) " ให้เหลือแค่เนื้อหา)
    // const cleanText = displayText.toString().replace(/^\d+\)\s*/, "");

    return `${dynamicText || ""} ${displayText}`.trim();
  };

  // return (
  //     <>
  //         <Box
  //             sx={{
  //                 justifyContent: "center",
  //                 backgroundColor: "white",
  //                 width: {
  //                     xs: "90%", // หน้าจอเล็ก
  //                     sm: "80%", // หน้าจอกลาง
  //                     md: "80%", // หน้าจอใหญ่
  //                     lg: "60%", // หน้าจอใหญ่มาก
  //                 },
  //                 height: "auto",
  //                 borderRadius: 3,
  //                 overflow: "hidden",
  //                 boxShadow: 3,
  //                 gap: 2,
  //                 mt: 4, // เพิ่ม margin-top เพื่อให้ไม่ติดขอบจอ
  //             }}
  //             key={section.id}
  //         >
  //             <Box
  //                 sx={{
  //                     display: "flex",
  //                     flexDirection: "column",
  //                     p: 2,
  //                     backgroundImage: `linear-gradient(to left, ${primaryColor ?? "#2196f3"
  //                         }, ${secondColor ?? "#f5f5f5"})`,
  //                 }}
  //             >
  //                 <Typography
  //                     sx={{
  //                         fontSize: 20,
  //                     }}
  //                 >
  //                     {section.section_title}
  //                 </Typography>
  //             </Box>

  //             {section?.is_dynamic && (
  //                 <Box
  //                     sx={{
  //                         display: "flex",
  //                         alignItems: "center",
  //                         position: "relative",
  //                         gap: 2,
  //                         p: 2,
  //                         px: 4,
  //                         borderRadius: 3,
  //                         background: `linear-gradient(135deg, ${lighten(
  //                             primaryColor,
  //                             0.85
  //                         )}, ${lighten(primaryColor, 0.95)})`,
  //                         boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
  //                         my: 2,
  //                         mx: {
  //                             xs: 2, // หน้าจอเล็ก
  //                             sm: 2, // หน้าจอกลาง
  //                             md: 4, // หน้าจอใหญ่
  //                             lg: 4, // หน้าจอใหญ่มาก
  //                         },
  //                     }}
  //                 >
  //                     <Box
  //                         sx={{
  //                             backgroundColor: primaryColor,
  //                             color: "#fff",
  //                             borderRadius: "50%",
  //                             p: 1,
  //                             display: "flex",
  //                             alignItems: "center",
  //                             justifyContent: "center",
  //                             height: 40,
  //                             width: 40,
  //                         }}
  //                     >
  //                         <EditNote sx={{ fontSize: 30 }} />
  //                     </Box>
  //                     <Typography
  //                         sx={{
  //                             fontSize: 16,
  //                             color: primaryColor,
  //                             fontWeight: "bold",
  //                         }}
  //                     >
  //                         {/* แสดงข้อความ dynamic_text ถ้ามี + คำตอบจาก dynamic_source_question_id */}
  //                     </Typography>
  //                 </Box>
  //             )}

  //             {section.section_note && (
  //                 <Box
  //                     sx={{
  //                         mx: { xs: 2, sm: 2, md: 4, lg: 4 },
  //                         mt: 2,
  //                         px: 2,
  //                         display: "flex",
  //                         alignItems: "flex-start",
  //                         gap: 1.5,
  //                     }}
  //                 >
  //                     <Info
  //                         sx={{
  //                             color: lighten(primaryColor, 0.4),
  //                             fontSize: 20,
  //                             mt: "2px",
  //                         }}
  //                     />
  //                     <Typography
  //                         sx={{
  //                             fontSize: 16,
  //                             fontStyle: "italic",
  //                             color: "#555",
  //                         }}
  //                     >
  //                         {section.section_note}
  //                     </Typography>
  //                 </Box>
  //             )}
  //             <Box
  //                 sx={{
  //                     display: "flex",
  //                     flexDirection: "column",
  //                     gap: 2,
  //                     m: {
  //                         xs: 2, // หน้าจอเล็ก
  //                         sm: 2, // หน้าจอกลาง
  //                         md: 4, // หน้าจอใหญ่
  //                         lg: 6, // หน้าจอใหญ่มาก
  //                     },
  //                 }}
  //             >
  //                 {section.questions.map((question, index) => {
  //                     const visible = shouldShowQuestion(question);
  //                     if (!visible) return null;

  //                     return (
  //                         <Box key={question.id}>
  //                             {/* Render คำถามที่นี่ */}
  //                             <QuestionSurvey
  //                                 question={question}
  //                                 answers={answers}
  //                                 primaryColor={primaryColor}
  //                                 secondColor={secondColor}
  //                                 onChange={(updatedQuestion) => {
  //                                     // Handle when answer question changes
  //                                     handleChangeAnswer(
  //                                         updatedQuestion.id,
  //                                         updatedQuestion.answer
  //                                     );
  //                                 }}
  //                             />
  //                         </Box>
  //                     );
  //                 })}
  //             </Box>
  //         </Box>
  //         {/* Render ปุ่มถัดไป */}

  //         <Box
  //             sx={{
  //                 justifyContent: "center",
  //                 width: {
  //                     xs: "90%", // หน้าจอเล็ก
  //                     sm: "80%", // หน้าจอกลาง
  //                     md: "80%", // หน้าจอใหญ่
  //                     lg: "60%", // หน้าจอใหญ่มาก
  //                 },
  //                 height: "auto",
  //                 overflow: "hidden",
  //                 gap: 2,
  //                 mt: 1,
  //             }}
  //             key={`footer-${section.id}`}
  //         >
  //             <Box
  //                 sx={{
  //                     display: "flex",
  //                     justifyContent:
  //                         section.section_no > 1 ? "space-between" : "flex-end", // ปุ่มย้อนกลับซ้าย ถัดไปขวา
  //                     mb: 2,
  //                 }}
  //             >
  //                 {section.section_no > 1 && onBack && (
  //                     <Button
  //                         sx={{
  //                             minWidth: 100,
  //                             borderRadius: 3,
  //                         }}
  //                         variant="outlined"
  //                         color="primary"
  //                         onClick={onBack}
  //                     >
  //                         ย้อนกลับ
  //                     </Button>
  //                 )}
  //                 {/* ปุ่มถัดไป หรือส่งแบบสอบถาม */}
  //                 {!is_last_section && onNext && (
  //                     <Button
  //                         sx={{
  //                             minWidth: 100,
  //                             borderRadius: 3,
  //                             color: "white",
  //                             fontWeight: "bold",
  //                         }}
  //                         // ปุ่มถัดไป ปิดใช้งานถ้ายังมีคำถามที่โดน is_required ที่ยังไม่ได้ตอบ
  //                         disabled={checkNextDisabled()}
  //                         variant="contained"
  //                         color="primary"
  //                         onClick={onNext}
  //                     >
  //                         ถัดไป
  //                     </Button>
  //                 )}
  //                 {/* ปุ่มส่งแบบสอบถาม */}
  //                 {is_last_section && onSubmit && (
  //                     <Button
  //                         sx={{
  //                             minWidth: 100,
  //                             borderRadius: 3,
  //                             color: "white",
  //                             fontWeight: "bold",
  //                         }}
  //                         variant="contained"
  //                         color="primary"
  //                         onClick={onSubmit}
  //                         disabled={checkNextDisabled()}
  //                     >
  //                         ส่งแบบสอบถาม
  //                     </Button>
  //                 )}
  //             </Box>
  //         </Box>
  //     </>
  // );

  return (
    <Box
      sx={{
        width: { xs: "90%", sm: "85%", md: "75%", lg: "60%" },
        mx: "auto",
        mb: 8,
      }}
    >
      {/* Container หลักที่เป็นกระดาษสีขาว */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0px 10px 30px rgba(0,0,0,0.08)", // เงาฟุ้งๆ ตามรูป
          backgroundColor: "#fff",
          position: "relative",
        }}
      >
        {/* ส่วนหัว Section */}
        <Box sx={{ p: { xs: 3, md: 4 }, pb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            {/* Icon Wrapper: กรอบสีเหลี่ยมสีฟ้าอ่อน */}
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: "12px", // ความโค้งมนตามรูป
                backgroundColor: lighten(primaryColor, 0.9), // สีฟ้าอ่อนพาสเทล
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {/* เลือก Icon ตามประเภท Section (ตัวอย่าง) */}
              {/* {section.section_no === 6 ? (
                                <ChatBubbleOutline sx={{ color: primaryColor, fontSize: 22 }} />
                            ) : (
                                <PersonOutline sx={{ color: primaryColor, fontSize: 24 }} />
                            )} */}
              {iconTitle[(section.section_no - 1) % iconTitle.length] &&
                React.cloneElement(
                  iconTitle[(section.section_no - 1) % iconTitle.length],
                  {
                    sx: { color: primaryColor, fontSize: 24 },
                  }
                )}
            </Box>

            {/* ข้อความ Title */}
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: "#2C3E50", // สีเข้มโทนน้ำเงิน-เทา เพื่อความหรูหรา
                fontSize: { xs: "1.1rem", md: "1.35rem" },
                letterSpacing: "0.5px",
              }}
            >
              {section.section_title}
            </Typography>
          </Box>

          {/* {section.section_note && (
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 1,
                                mt: 1,
                                p: 2,
                                borderRadius: 2,
                                backgroundColor: lighten(primaryColor, 0.95), // พื้นหลังสีอ่อนๆ
                                borderLeft: `4px solid ${primaryColor}`,
                            }}
                        >
                            <Info sx={{ color: primaryColor, fontSize: 20, mt: 0.3 }} />
                            <Typography sx={{ fontSize: 15, color: "#555", fontStyle: "italic" }}>
                                {section.section_note}
                            </Typography>
                        </Box>
                    )} */}
        </Box>

        <Divider sx={{ mx: 4, opacity: 0.6 }} />

        {section?.is_dynamic && (
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
              {renderDynamicText(
                section.dynamic_text,
                section.dynamic_source_question_id
              )}
            </Typography>
          </Box>
        )}

        {section.section_note && (
          <Box
            sx={{
              display: "flex",
              gap: 1,
              mt: 2,
              px: { xs: 3, md: 4 },
              // borderRadius: 2,
              // backgroundColor: lighten(primaryColor, 0.95), // พื้นหลังสีอ่อนๆ
              // borderLeft: `4px solid ${primaryColor}`,
            }}
          >
            <Info sx={{ color: primaryColor, fontSize: 20, mt: 0.3 }} />
            <Typography
              sx={{ fontSize: 15, color: "#555", fontStyle: "italic" }}
            >
              {section.section_note}
            </Typography>
          </Box>
        )}

        {/* รายการคำถาม */}
        <Box
          sx={{
            p: { xs: 2, md: 4 },
            display: "flex",
            flexDirection: "column",
            gap: 4, // ระยะห่างระหว่างข้อ
          }}
        >
          {section.questions
            .filter((q) => shouldShowQuestion(q)) // Filter ข้อที่ซ่อนออกไปก่อน
            .map((question, index) => {
              // const visible = shouldShowQuestion(question);
              // if (!visible) return null;
              const questionNumber = index + 1;

              const hasRequireCondition = sections.some((s) =>
                s.questions.some((q) =>
                  q.options.some((opt) =>
                    (opt.conditions || []).some(
                      (cond) =>
                        cond.condition_type === "require_question" &&
                        cond.target_question_id === question.id
                    )
                  )
                )
              );

              const isNegativeResponse =
                question.question?.includes("ไม่เห็นด้วย");

              // เลือกสี: ถ้ามีคำว่าไม่เห็นด้วยใช้สีแดง (Soft Red), ถ้าไม่มีใช้สีหลัก (Primary)
              const highlightColor = isNegativeResponse
                ? "#d32f2f"
                : primaryColor;

              return (
                <Box
                  key={question.id}
                  // sx={{
                  //     transition: "all 0.3s ease",
                  //     "&:hover": { transform: "translateX(4px)" } // Effect เล็กน้อยตอน hover
                  // }}
                  sx={{
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    borderRadius: 4, // ความโค้งมนตามรูปตัวอย่าง

                    // ถ้าเป็นข้อที่มีเงื่อนไข ให้ใส่กรอบและพื้นหลังสีฟ้า
                    ...// กรณีที่ 1: ไม่ใช่ Matrix และมี Require Condition
                    (((hasRequireCondition &&
                      question.question_type_id !== 9) ||
                      // กรณีที่ 2: เป็น Matrix (Type 9) และมี row เดียวเท่านั้น
                      (question.question_type_id === 9 &&
                        question.matrix_rows?.length === 1)) && {
                      p: { xs: 2, md: 3 }, // เพิ่มพื้นที่ด้านในกรอบ
                      mb: 2,
                      mx: 2, // ระยะห่างจากข้อถัดไป
                      backgroundColor: lighten(highlightColor, 0.97), // สีฟ้าอ่อนมากๆ
                      border: `1.5px solid ${lighten(highlightColor, 0.8)}`, // เส้นขอบสีฟ้าจาง
                      boxShadow: `0px 4px 20px rgba(0, 0, 0, 0.04)`, // เงาบางๆ
                      animation: "slideDownFade 0.5s ease-out",
                    }),

                    // Animation ตอนข้อความโผล่มา
                    "@keyframes slideDownFade": {
                      "0%": { opacity: 0, transform: "translateY(-10px)" },
                      "100%": { opacity: 1, transform: "translateY(0)" },
                    },
                  }}
                >
                  <QuestionSurvey
                    // question={question}
                    question={{
                      ...question,
                      display_number: `${section.section_no}.${questionNumber}`,
                    }}
                    answers={answers}
                    primaryColor={primaryColor}
                    secondColor={secondColor}
                    onChange={(updatedQuestion) => {
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

        {/* ส่วน Footer ปุ่มกด */}
        <Box
          sx={{
            p: 3,
            backgroundColor: "#fcfcfc",
            borderTop: "1px solid #eee",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            {section.section_no > 0 && (
              <Button
                variant="text"
                startIcon={<KeyboardArrowLeft />}
                onClick={onBack}
                sx={{ color: "#777", fontWeight: 600 }}
              >
                ย้อนกลับ
              </Button>
            )}
          </Box>

          <Button
            variant="contained"
            disabled={checkNextDisabled()}
            onClick={is_last_section ? onSubmit : onNext}
            endIcon={
              is_last_section ? (
                <SendOutlined
                  sx={{
                    // กำหนดทิศทางของไอคอนให้ชี้เฉียงขึ้นไปทางขวา
                    transform: "rotate(-45deg)",
                    fontSize: 20,
                    mb: "2px",
                  }}
                />
              ) : (
                <KeyboardArrowRight />
              )
            }
            sx={{
              px: 4,
              py: 1,
              borderRadius: 3,
              fontSize: "1rem",
              fontWeight: "bold",
              boxShadow: `0 2px 4px 0 ${lighten(primaryColor, 0.4)}`,
              backgroundColor: primaryColor,
              "&:hover": {
                backgroundColor: primaryColor,
                filter: "brightness(0.9)",
              },
              "&.Mui-disabled": {
                backgroundColor: "#e0e0e0",
              },
            }}
          >
            {is_last_section ? "ส่งแบบสอบถาม" : "ถัดไป"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default SectionSurvey;
