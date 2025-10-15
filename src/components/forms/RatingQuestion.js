"use client"
import { Autocomplete, Box, Checkbox, FormControl, FormControlLabel, InputLabel, ListItemIcon, MenuItem, Select, TextField, Typography } from "@mui/material";
import React from "react";
import { ratingTypes } from "../../contants/ratingTypes";
const RatingQuestion = ({ question, onChange }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
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
                        value={question.vote_type_id || ""}
                        onChange={(e) => onChange({ ...question, vote_type_id: e.target.value })}
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
            <Box sx={{ fontSize: 14, color: 'text.secondary' }}>
                ตัวอย่าง: {question.max_scale || 5} ระดับ
                {question.vote_type_id === 1 && " (ดาว)"}{question.vote_type_id === 2 && " (รูปยิ้ม)"}{question.vote_type_id === 3 && " (ปลายนิ้ว)"}{question.vote_type_id === 4 && " (หัวใจ)"}
            </Box>
            <Box
                sx={{
                    fontSize: 16,
                    color: "text.secondary",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    alignItems: "center",
                    mb: 2,
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
                    {question.is_irrelevant && (
                        <Box sx={{ minWidth: 40, textAlign: "center" }}>
                            <Typography variant="body2" color="textSecondary">
                                {question.irrelevant_text || "N/A"}
                            </Typography>
                        </Box>
                    )}
                </Box>

                {/* บรรทัด icon */}
                <Box sx={{ display: "flex", flexDirection: "row" }}>

                    {[...Array(parseInt(question.max_scale || 5)).keys()].map((i) => (
                        <Box key={i} sx={{ minWidth: 40, textAlign: "center" }}>
                            <i style={{ fontSize: 20, color: "red" }}>{ratingTypes.find(r => r.id === question.vote_type_id)?.icon}</i>
                        </Box>
                    ))}
                    {question.is_irrelevant && (
                        <Box sx={{ minWidth: 40, textAlign: "center" }}>
                            <i style={{ fontSize: 20, color: "gray" }}>{ratingTypes.find(r => r.id === question.vote_type_id)?.icon}</i>
                        </Box>
                    )}
                </Box>
            </Box>


        </Box>
    )
}
export default RatingQuestion;
