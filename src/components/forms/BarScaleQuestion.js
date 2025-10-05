"use client";
import { Box, Button, TextField, Typography } from "@mui/material";
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
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                    mt: 1,
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
        </Box>
    );
};
export default BarScaleQuestion;