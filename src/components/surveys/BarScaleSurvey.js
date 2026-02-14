import { Box, Button, Checkbox, FormControlLabel, Typography, lighten } from "@mui/material";

// const BarScaleSurvey = ({ question, answer, primaryColor, secondColor, onChange }) => {
//     const scale_length = parseInt(question.scale_labels?.length || 5);
//     return (
//         <>
//             <Box
//                 sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     flexDirection: "row",
//                     justifyContent: "center",
//                     px: 2,
//                 }}
//             >
//                 {[...Array(parseInt(scale_length || 5)).keys()].map((i) => {
//                     const isFirst = i === 0;
//                     const isLast = i === parseInt(scale_length || 5) - 1;
//                     const ratio = i / (scale_length - 1);
//                     const red = Math.round(229 + (67 - 229) * ratio); // 229→67
//                     const green = Math.round(57 + (160 - 57) * ratio); // 57→160
//                     const blue = Math.round(53 + (71 - 53) * ratio); // 53→71
//                     const color = `rgb(${red}, ${green}, ${blue})`;

//                     return (
//                         <Button
//                             key={i}
//                             variant="outlined"
//                             sx={{
//                                 minWidth: "50px",
//                                 width: question.max_scale ? `calc(100% / ${question.max_scale})` : '20%',
//                                 height: "40px",
//                                 border: "1px solid",
//                                 borderColor: color,
//                                 borderRadius: isFirst ? "20px 0 0 20px" : isLast ? "0 20px 20px 0" : "0",
//                                 backgroundColor: answer && answer.answer_value >= (question.scale_labels[i] ? question.scale_labels[i].value : i + 1) ? color : 'transparent',
//                                 color: answer && answer.answer_value >= (question.scale_labels[i] ? question.scale_labels[i].value : i + 1) ? '#fff' : color,

//                                 "&:hover": {
//                                     backgroundColor: color,
//                                     color: "#fff",
//                                 },
//                             }}
//                             onClick={() => {
//                                 onChange({
//                                     ...question,
//                                     answer: {
//                                         section_id: question.section_id,
//                                         question_id: question.id,
//                                         answer_option_id: null,
//                                         answer_value: question.scale_labels[i] ? question.scale_labels[i].value : i + 1,
//                                         attachment_url: null,
//                                         answer_text: null,
//                                     }
//                                 });
//                             }}
//                         >
//                             <Typography
//                                 sx={{
//                                     fontSize: "12px",
//                                 }}
//                             >
//                                 {question.scale_labels[i] ? question.scale_labels[i].label : ''}
//                             </Typography>
//                         </Button>
//                     );
//                 })}
//             </Box>
//             {question.is_irrelevant && <Box sx={{
//                 display: "flex",
//                 flexDirection: "row",
//                 gap: 4,
//                 ml: 4,
//             }}>
//                 <FormControlLabel
//                     control={
//                         <Checkbox
//                             checked={false}
//                             onChange={() => { }}
//                         />
//                     }
//                     label={question.irrelevant_text || "ไม่ประสงค์ตอบ"}
//                 />
//             </Box>}
//         </>
//     );
// }

const BarScaleSurvey = ({ question, answer, primaryColor, secondColor, onChange }) => {
    // กำหนดจำนวนสเกล (default เป็น 5)
    const scale_length = parseInt(question.max_scale || 5);

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* ส่วนของกล่องคะแนน */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between", // กระจายกล่องให้เต็มความกว้าง
                    alignItems: "center",
                    gap: { xs: 1, sm: 2 },
                    px: { xs: 0, md: 2 },
                }}
            >
                {[...Array(scale_length).keys()].map((i) => {
                    const currentVal = question.scale_labels[i] ? question.scale_labels[i].value : i + 1;
                    const currentLabel = question.scale_labels[i] ? question.scale_labels[i].label : '';

                    // เช็คว่าถูกเลือกหรือไม่ (Logic เหมือนเดิม)
                    const isSelected = answer && Number(answer.answer_value) === Number(currentVal);

                    return (
                        <Box
                            key={i}
                            onClick={() => {
                                onChange({
                                    ...question,
                                    answer: {
                                        section_id: question.section_id,
                                        question_id: question.id,
                                        answer_option_id: null,
                                        answer_value: currentVal,
                                        attachment_url: null,
                                        answer_text: null,
                                    }
                                });
                            }}
                            sx={{
                                flex: 1,
                                aspectRatio: "1/1", // ทำให้เป็นสี่เหลี่ยมจตุรัส
                                maxWidth: 100,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                borderRadius: 3,
                                border: isSelected ? "none" : "1px solid #eee",
                                backgroundColor: isSelected ? "transparent" : "#fff",
                                // ใช้ Gradient สีตามที่กำหนดใน primaryColor
                                backgroundImage: isSelected
                                    ? `linear-gradient(135deg, ${primaryColor} 0%, ${lighten(primaryColor, 0.3)} 100%)`
                                    : "none",
                                boxShadow: isSelected
                                    ? `0 10px 20px ${lighten(primaryColor, 0.6)}`
                                    : "none",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    transform: "translateY(-4px)",
                                    borderColor: primaryColor,
                                }
                            }}
                        >
                            {/* ตัวเลขคะแนน */}
                            <Typography
                                sx={{
                                    fontSize: { xs: 18, sm: 24 },
                                    fontWeight: 800,
                                    color: isSelected ? "#fff" : "#ccc",
                                }}
                            >
                                {currentVal}
                            </Typography>

                            {/* คำอธิบายสเกล (ถ้ามี) */}
                            {currentLabel && (
                                <Typography
                                    sx={{
                                        fontSize: 10,
                                        fontWeight: 500,
                                        color: isSelected ? "rgba(255,255,255,0.8)" : "#999",
                                        mt: 0.5,
                                        textAlign: "center",
                                        px: 0.5
                                    }}
                                >
                                    {currentLabel}
                                </Typography>
                            )}
                        </Box>
                    );
                })}
            </Box>

            {/* ส่วนของ "ไม่ประสงค์ตอบ" (Irrelevant) */}
            {question.is_irrelevant && (
                <Box sx={{ display: "flex", justifyContent: "flex-start", ml: 1 }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                size="small"
                                checked={answer?.answer_value === "irrelevant"}
                                onChange={(e) => {
                                    onChange({
                                        ...question,
                                        answer: e.target.checked ? {
                                            section_id: question.section_id,
                                            question_id: question.id,
                                            answer_value: "irrelevant",
                                            answer_text: question.irrelevant_text || "ไม่ประสงค์ตอบ"
                                        } : null
                                    });
                                }}
                                sx={{
                                    color: "#ccc",
                                    '&.Mui-checked': { color: primaryColor }
                                }}
                            />
                        }
                        label={
                            <Typography sx={{ fontSize: 14, color: "#666" }}>
                                {question.irrelevant_text || "ไม่ประสงค์ตอบ"}
                            </Typography>
                        }
                    />
                </Box>
            )}
        </Box>
    );
};

export default BarScaleSurvey;