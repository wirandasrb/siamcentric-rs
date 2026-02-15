"use client";
import { Box, Button, Checkbox, FormControlLabel, TextField, Typography, lighten } from "@mui/material";
import React from "react";
import { defaultScaleLabels } from "../../contants/scaleBarLabel";

const BarScaleQuestion = ({ question, onChange }) => {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 2,
                    alignItems: "center"
                }}
            >
                <Typography>จำนวนระดับ: </Typography>
                <TextField
                    type="number"
                    sx={{
                        width: 100,
                        '& .MuiInputBase-root': { height: '40px' }
                    }}
                    InputProps={{ inputProps: { min: 2, max: 10 } }}
                    InputLabelProps={{ shrink: true }}
                    value={question.max_scale || 5}
                    onChange={(e) => onChange({ ...question, max_scale: Number(e.target.value) })}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={question.is_irrelevant || false}
                            onChange={(e) => onChange({ ...question, is_irrelevant: e.target.checked })}
                        />
                    }
                    label="อนุญาตให้ตอบไม่เกี่ยวข้อง"
                />
                <TextField
                    variant="standard"
                    label="ข้อความแสดงไม่เกี่ยวข้อง"
                    disabled={!question.is_irrelevant}
                    placeholder="เช่น ไม่ทราบ / ไม่ประสงค์ตอบ"
                    InputLabelProps={{ shrink: true }}
                    value={question.irrelevant_text || ""}
                    onChange={(e) => onChange({ ...question, irrelevant_text: e.target.value })}
                    sx={{
                        flex: 1,
                        '& .MuiInputBase-root': {
                            height: '40px',
                            width: '30%'
                        }
                    }}
                />
            </Box>
            {[...Array(Number(question.max_scale) || 5)].map((_, index) => (
                <Box key={index} sx={{ display: "flex", flexDirection: "row", gap: 2, alignItems: "center" }}>
                    <Typography
                        variant="body1"
                        sx={{
                            width: 40, // ล็อกความกว้างของตัวเลขให้คงที่
                            textAlign: "center",
                        }}
                    >
                        {index + 1}
                    </Typography>
                    <TextField
                        variant="standard"
                        sx={{
                            '& .MuiInputBase-root': { height: '40px', width: '100%' }
                        }}
                        placeholder={`คำอธิบายระดับที่ ${index + 1}`}
                        value={(question.scale_labels && question.scale_labels[index] && question.scale_labels[index].label) || ""}
                        onChange={(e) => {
                            const newDescriptions = [...(question.scale_labels || [])];
                            newDescriptions[index] = e.target.value;
                            onChange({ ...question, scale_labels: newDescriptions });
                        }}
                    />
                </Box>
            ))}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
                <Box sx={{ fontSize: 14, color: 'text.secondary', ml: 1 }}>
                    ตัวอย่าง: {question.max_scale || 5} ระดับ
                </Box>

                <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 16, color: "text.secondary", ml: 2 }}>
                    {question.question_no}. {question.question}
                </Typography>

                {/* ส่วนแสดงกล่องคะแนนตัวอย่าง */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        gap: { xs: 1, sm: 2 },
                        px: 2,
                        flexWrap: "wrap"
                    }}
                >
                    {[...Array(parseInt(question.max_scale || 5)).keys()].map((i) => {
                        const currentVal = i + 1;
                        const currentLabel = defaultScaleLabels[i] ? defaultScaleLabels[i].label : '';

                        // จำลองการ Highlight บางช่องเพื่อให้เห็น UI (เช่น ช่องที่ 4)
                        const isMockSelected = i === 3;

                        return (
                            <Box
                                key={i}
                                sx={{
                                    flex: { xs: "none", sm: 1 },
                                    aspectRatio: "1/1",
                                    width: { xs: "60px", sm: "auto" },
                                    maxWidth: 100,
                                    minWidth: { sm: "70px" },
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: 3,
                                    border: isMockSelected ? "none" : "1px solid #eee",
                                    backgroundColor: isMockSelected ? "transparent" : "#fff",
                                    backgroundImage: isMockSelected
                                        ? `linear-gradient(135deg, ${'#1976d2'} 0%, ${lighten('#1976d2', 0.3)} 100%)`
                                        : "none",
                                    boxShadow: isMockSelected
                                        ? `0 8px 16px ${lighten('#1976d2', 0.6)}`
                                        : "none",
                                    // ปิดการคลิกและ cursor
                                    pointerEvents: "none",
                                    userSelect: "none"
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: { xs: 18, sm: 22 },
                                        fontWeight: 800,
                                        color: isMockSelected ? "#fff" : "#ccc",
                                    }}
                                >
                                    {currentVal}
                                </Typography>

                                {currentLabel && (
                                    <Typography
                                        sx={{
                                            fontSize: 9,
                                            fontWeight: 500,
                                            color: isMockSelected ? "rgba(255,255,255,0.8)" : "#999",
                                            mt: 0.5,
                                            textAlign: "center",
                                            px: 0.5,
                                            lineHeight: 1.1
                                        }}
                                    >
                                        {currentLabel}
                                    </Typography>
                                )}
                            </Box>
                        );
                    })}
                </Box>

                {/* ส่วน "ไม่ประสงค์ตอบ" ตัวอย่าง */}
                {question.is_irrelevant && (
                    <Box sx={{ display: "flex", justifyContent: "flex-start", ml: 1, opacity: 0.6, pointerEvents: "none" }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    size="small"
                                    sx={{ color: "#ccc" }}
                                />
                            }
                            label={
                                <Typography sx={{ fontSize: 13, color: "#666" }}>
                                    {question.irrelevant_text || "ไม่ประสงค์ตอบ"} (ตัวอย่าง)
                                </Typography>
                            }
                        />
                    </Box>
                )}
            </Box>
            {/* <Box sx={{ fontSize: 14, mt: 2, color: 'text.secondary' }}>
                ตัวอย่าง: {question.max_scale || 5} ระดับ
            </Box>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                    px: 2,
                }}
            >
                {[...Array(parseInt(question.max_scale || 5)).keys()].map((i) => {
                    const isFirst = i === 0;
                    const isLast = i === parseInt(question.max_scale || 5) - 1;
                    return (
                        <Button
                            key={i}
                            variant="outlined"
                            sx={{
                                minWidth: "50px",
                                width: question.max_scale ? `calc(100% / ${question.max_scale})` : '20%',
                                height: "40px",
                                border: "1px solid",
                                borderRadius: isFirst ? "20px 0 0 20px" : isLast ? "0 20px 20px 0" : "0",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: "12px",
                                }}
                            >
                                {defaultScaleLabels[i] ? defaultScaleLabels[i].label : ''}
                            </Typography>
                        </Button>
                    );
                })}
            </Box>
            {question.is_irrelevant && <Box sx={{
                display: "flex",
                flexDirection: "row",
                gap: 4,
                ml: 4,
            }}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={false}
                            disabled
                        />
                    }
                    label={question.irrelevant_text || "ไม่ประสงค์ตอบ"}
                />
            </Box>} */}

        </Box>
    );
};
export default BarScaleQuestion;