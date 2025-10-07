"use client";

import { CircleOutlined } from "@mui/icons-material";
import { Box, Checkbox, FormControlLabel, Grid, Menu, MenuItem, Select, TextField, Typography } from "@mui/material";

const LinearScaleQuestion = ({ question, onChange }) => {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 2, alignItems: "center" }}>
                <Typography>ช่วงของระดับ: </Typography>
                <Select
                    sx={{
                        minWidth: 100,
                        height: '40px',
                    }}
                    value={question.min_scale || 0}
                    onChange={(e) => onChange({ ...question, min_scale: e.target.value })}
                >
                    {[...Array(2).keys()].map((i) => (
                        <MenuItem key={i} value={i}>
                            {i}
                        </MenuItem>
                    ))}
                </Select>
                <Typography>ถึง</Typography>
                <Select
                    sx={{
                        minWidth: 100,
                        height: '40px',
                    }}
                    value={question.max_scale || 5}
                    onChange={(e) => onChange({ ...question, max_scale: e.target.value })}
                >
                    {[...Array(9).keys()].map((i) => (
                        <MenuItem key={i + 2} value={i + 2}>
                            {i + 2}
                        </MenuItem>
                    ))}
                </Select>
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
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    mt: 1,
                }}
            >
                {/* ด้านซ้าย - ระดับต่ำสุด */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography
                        variant="body1"
                        sx={{
                            width: 40, // ล็อกความกว้างของตัวเลขให้คงที่
                            textAlign: "center",
                        }}
                    >
                        {question.min_scale}
                    </Typography>
                    <TextField
                        label="คำอธิบายระดับต่ำสุด"
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        sx={{
                            minWidth: 200,
                            '& .MuiInputBase-root': { height: 40 },
                        }}
                        value={question.min_label || ""}
                        onChange={(e) => onChange({ ...question, min_label: e.target.value })}
                    />
                </Box>

                {/* ด้านขวา - ระดับสูงสุด */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography
                        variant="body1"
                        sx={{
                            width: 40,
                            textAlign: "center",
                        }}
                    >
                        {question.max_scale}
                    </Typography>
                    <TextField
                        label="คำอธิบายระดับสูงสุด"
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        sx={{
                            minWidth: 200,
                            '& .MuiInputBase-root': { height: 40 },
                        }}
                        value={question.max_label || ""}
                        onChange={(e) => onChange({ ...question, max_label: e.target.value })}
                    />
                </Box>
            </Box>


            <Box sx={{ fontSize: 14, color: 'text.secondary' }}>
                ตัวอย่าง: {question.min_scale || 0} ถึง {question.max_scale || 5} ระดับ
            </Box>
            <Box sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: 'row',
                gap: 4,
                fontSize: 14,
            }}>
                <Typography>{question.min_label || ""}</Typography>
                <Box sx={{
                    fontSize: 16,
                    color: "text.secondary",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    alignItems: "center",
                    mb: 2,
                }}>
                    {/* บรรทัดตัวเลข */}
                    <Box sx={{ display: "flex", flexDirection: "row", gap: 4 }} >
                        {[...Array(parseInt(question.max_scale || 5)).keys()].map((i) => (
                            <Box
                                key={i}
                                sx={{ minWidth: 40, textAlign: "center" }}
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
                    <Box sx={{ display: "flex", flexDirection: "row", gap: 4 }}>
                        {[...Array(parseInt(question.max_scale || 5)).keys()].map((i) => (
                            <Box key={i} sx={{ minWidth: 40, textAlign: "center" }}>
                                <CircleOutlined fontSize="small" />
                            </Box>
                        ))}
                        {question.is_irrelevant && (
                            <Box sx={{ minWidth: 40, textAlign: "center" }}>
                                <CircleOutlined fontSize="small" />
                            </Box>
                        )}
                    </Box>
                </Box>
                <Typography>{question.max_label || ""}</Typography>
            </Box>

        </Box>
    );
};
export default LinearScaleQuestion;