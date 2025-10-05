"use client"
import { Autocomplete, Box, FormControl, InputLabel, ListItemIcon, MenuItem, Select, TextField, Typography } from "@mui/material";
import React from "react";
import { ratingTypes } from "../../contants/ratingTypes";
const RatingQuestion = ({ question, onChange }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                <FormControl sx={{
                    width: 'fit-content',
                    '& .MuiInputBase-root': { height: '40px' }
                }}>
                    <InputLabel id="rating-type-label">
                        รูปแบบ
                    </InputLabel>
                    <Select
                        labelId="rating-type-label"
                        id="rating-type-select"
                        value={question.rating_type_id || ""}
                        onChange={(e) => onChange({ ...question, rating_type_id: e.target.value })}
                        label="รูปแบบ"
                    >
                        {ratingTypes.map((type) => (
                            <MenuItem key={type.value} value={type.id} >
                                <ListItemIcon>{type.icon}</ListItemIcon>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label="จำนวนระดับ"
                    type="number"
                    value={question.max_scale || ""}
                    InputProps={{ inputProps: { min: 2, max: 10 } }}
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => onChange({ ...question, max_scale: e.target.value })}
                    sx={{
                        display: 'flex', width: 100,
                        '& .MuiInputBase-root': { height: '40px' }
                    }}
                />
            </Box>
            <Box sx={{ fontSize: 14, color: 'text.secondary' }}>
                ตัวอย่าง: {question.max_scale || 5} ระดับ
                {question.rating_type_id === 1 && " (ดาว)"}{question.rating_type_id === 2 && " (รูปยิ้ม)"}{question.rating_type_id === 3 && " (ปลายนิ้ว)"}{question.rating_type_id === 4 && " (หัวใจ)"}
            </Box>
            <Box
                sx={{
                    fontSize: 16,
                    color: "text.secondary",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    alignItems: "center",
                }}
            >
                {/* บรรทัดตัวเลข */}
                <Box sx={{ display: "flex", flexDirection: "row" }}>
                    {[...Array(parseInt(question.max_scale || 5)).keys()].map((i) => (
                        <Box
                            key={i}
                            sx={{ minWidth: 40, textAlign: "center" }} // ให้ช่องแต่ละอันเท่ากัน
                        >
                            <Typography variant="body2" color="textSecondary">
                                {i + 1}
                            </Typography>
                        </Box>
                    ))}
                </Box>

                {/* บรรทัด icon */}
                <Box sx={{ display: "flex", flexDirection: "row" }}>
                    {question.rating_type_id === 1 &&
                        [...Array(parseInt(question.max_scale || 5)).keys()].map((i) => (
                            <Box key={i} sx={{ minWidth: 40, textAlign: "center" }}>
                                <i style={{ color: "#fbc02d" }}>{ratingTypes[0].icon}</i>
                            </Box>
                        ))}
                    {question.rating_type_id === 2 &&
                        [...Array(parseInt(question.max_scale || 5)).keys()].map((i) => (
                            <Box key={i} sx={{ minWidth: 40, textAlign: "center" }}>
                                <span
                                    style={{
                                        fontSize: 20,
                                        color:
                                            i < parseInt(question.max_scale || 5) / 2
                                                ? "#558b2f"
                                                : "#c8e6c9",
                                    }}
                                >
                                    {ratingTypes[1].icon}
                                </span>
                            </Box>
                        ))}
                    {question.rating_type_id === 3 &&
                        [...Array(parseInt(question.max_scale || 5)).keys()].map((i) => (
                            <Box key={i} sx={{ minWidth: 40, textAlign: "center" }}>
                                <i style={{ fontSize: 20, color: "#1e88e5" }}>
                                    {ratingTypes[2].icon}
                                </i>
                            </Box>
                        ))}
                    {question.rating_type_id === 4 &&
                        [...Array(parseInt(question.max_scale || 5)).keys()].map((i) => (
                            <Box key={i} sx={{ minWidth: 40, textAlign: "center" }}>
                                <i style={{ fontSize: 20, color: "red" }}>{ratingTypes[3].icon}</i>
                            </Box>
                        ))}
                </Box>
            </Box>


        </Box>
    )
}
export default RatingQuestion;
