import { Circle, PowerInput, Add, Delete, Remove, Clear, CircleOutlined } from "@mui/icons-material";
import {
    Box,
    Grid,
    MenuItem,
    Select,
    Typography,
    IconButton,
    TextField,
    Button,
    Radio,
} from "@mui/material";
import { useState } from "react";

const matrixOptions = [
    { value: "single_choice", label: "ตัวเลือกเดี่ยว", icon: <CircleOutlined /> },
    { value: "rating_bar", label: "การให้คะแนน", icon: <PowerInput /> },
];

const MatrixQuestion = ({ question, onChange }) => {
    // ใช้ state ภายในเพื่อควบคุม row/column list
    const [rows, setRows] = useState(["แถวที่ 1"]);
    const [columns, setColumns] = useState(["คอลัมน์ที่ 1"]);

    // เพิ่ม/ลบแถว
    const addRow = () => setRows([...rows, `แถวที่ ${rows.length + 1}`]);
    const removeRow = (index) => setRows(rows.filter((_, i) => i !== index));

    // เพิ่ม/ลบคอลัมน์
    const addColumn = () =>
        setColumns([...columns, `คอลัมน์ที่ ${columns.length + 1}`]);
    const removeColumn = (index) =>
        setColumns(columns.filter((_, i) => i !== index));

    // แก้ชื่อแถว/คอลัมน์
    const updateRow = (index, value) => {
        const updated = [...rows];
        updated[index] = value;
        setRows(updated);
    };

    const updateColumn = (index, value) => {
        const updated = [...columns];
        updated[index] = value;
        setColumns(updated);
    };

    return (
        <Box sx={{ display: "flex", mb: 2, width: "100%", flexDirection: "column", gap: 2 }}>
            {/* ส่วนเลือกประเภทของ matrix */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 2,
                    alignItems: "center",
                }}
            >
                <Typography
                    variant="body1"
                    sx={{ minWidth: 120, alignItems: "center", display: "flex" }}
                >
                    ประเภทตัวเลือก:
                </Typography>
                <Select
                    value={question?.grid_type || "single_choice"}
                    onChange={(e) => onChange({ grid_type: e.target.value })}
                    sx={{ minWidth: 200 }}
                    size="small"
                    MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
                >
                    {matrixOptions.map((option) => (
                        <MenuItem
                            key={option.value}
                            value={option.value}
                            sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                            {option.icon}
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </Box>

            {/* ส่วนแถว/คอลัมน์ */}
            <Grid container spacing={4} sx={{ mt: 2, width: "100%" }}>
                {/* ฝั่งซ้าย: แถว */}
                <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", width: "100%", flex: 1 }}>
                    <Typography sx={{ mb: 1, fontSize: 16 }}>
                        แถว:
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1.5,
                            border: "1px solid #ddd",
                            borderRadius: 2,
                            p: 2,
                            width: "100%",
                            flex: 1, // ✅ ให้ box ยืดเต็ม Grid item
                        }}
                    >
                        {rows.map((row, index) => (
                            <Box
                                key={index}
                                sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}
                            >
                                <TextField
                                    fullWidth
                                    size="small"
                                    variant="standard"
                                    value={row}
                                    onChange={(e) => updateRow(index, e.target.value)}
                                    placeholder={`แถวที่ ${index + 1}`}
                                />
                                <IconButton
                                    color="error"
                                    onClick={() => removeRow(index)}
                                    disabled={rows.length === 1}
                                >
                                    <Clear fontSize="small" />
                                </IconButton>
                            </Box>
                        ))}

                        <Button
                            startIcon={<Add />}
                            size="small"
                            onClick={addRow}
                            sx={{ alignSelf: "flex-start", mt: 1 }}
                        >
                            เพิ่มแถว
                        </Button>
                    </Box>
                </Grid>

                {/* ฝั่งขวา: คอลัมน์ */}
                <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", width: "100%", flex: 1 }}>
                    <Typography sx={{ mb: 1, fontSize: 16 }}>
                        คอลัมน์:
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1.5,
                            border: "1px solid #ddd",
                            borderRadius: 2,
                            p: 2,
                            width: "100%",
                            flex: 1, // ✅ ให้ box ยืดเต็ม Grid item
                        }}
                    >
                        {columns.map((col, index) => (
                            <Box
                                key={index}
                                sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}
                            >
                                <TextField
                                    fullWidth
                                    size="small"
                                    variant="standard"
                                    value={col}
                                    onChange={(e) => updateColumn(index, e.target.value)}
                                    placeholder={`คอลัมน์ที่ ${index + 1}`}
                                />
                                <IconButton
                                    color="error"
                                    onClick={() => removeColumn(index)}
                                    disabled={columns.length === 1}
                                >
                                    <Clear fontSize="small" />
                                </IconButton>
                            </Box>
                        ))}

                        <Button
                            startIcon={<Add />}
                            size="small"
                            onClick={addColumn}
                            sx={{ alignSelf: "flex-start", mt: 1 }}
                        >
                            เพิ่มคอลัมน์
                        </Button>
                    </Box>
                </Grid>
            </Grid>
            <Box sx={{ fontSize: 14, color: 'text.secondary' }}>
                ตัวอย่าง: {rows.length} แถว x {columns.length} คอลัมน์
            </Box>
            {/* ส่วนแสดงตัวอย่างตาราง */}
            <Box sx={{
                display: "flex",
                px: 2,
            }}
            >
                {question?.grid_type === "single_choice" ? (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            border: "1px solid #ddd",
                            borderRadius: 2,
                            overflowX: "auto",
                            width: "100%",
                            p: 2,
                        }}
                    >
                        {/* หัวตาราง (ชื่อคอลัมน์) */}
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: `200px repeat(${columns.length}, 1fr)`,
                                alignItems: "center",
                                borderBottom: "1px solid #ccc",
                                pb: 1,
                                mb: 1,
                            }}
                        >
                            <Box />
                            {columns.map((col, colIndex) => (
                                <Typography
                                    key={colIndex}
                                    variant="body2"
                                    sx={{
                                        textAlign: "center",
                                        fontWeight: 500,
                                        color: "text.secondary",
                                    }}
                                >
                                    {col}
                                </Typography>
                            ))}
                        </Box>

                        {/* แถวคำถาม */}
                        {rows.map((row, rowIndex) => (
                            <Box
                                key={rowIndex}
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: `200px repeat(${columns.length}, 1fr)`,
                                    alignItems: "center",
                                    borderBottom: rowIndex !== rows.length - 1 ? "1px solid #eee" : "none",
                                    py: 1,
                                }}
                            >
                                <Typography variant="body2" sx={{ color: "text.primary" }}>
                                    {row}
                                </Typography>

                                {columns.map((_, colIndex) => (
                                    <Box
                                        key={colIndex}
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Radio disabled fontSize="small" color="disabled" />
                                    </Box>
                                ))}
                            </Box>
                        ))}
                    </Box>
                ) : question?.grid_type === "rating_bar" ? (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            width: "100%",
                        }}
                    >
                        {rows.map((row, rowIndex) => (
                            <Box key={rowIndex} sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    {rowIndex + 1}. {row}
                                </Typography>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        flexDirection: "row",
                                        justifyContent: "center",
                                        px: 2,
                                    }}
                                >
                                    {columns.map((col, colIndex) => {
                                        const isFirst = colIndex === 0;
                                        const isLast = colIndex === columns.length - 1;
                                        return (
                                            <Button
                                                key={colIndex}
                                                variant="outlined"
                                                sx={{
                                                    minWidth: "50px",
                                                    width: columns.length ? `calc(100% / ${columns.length})` : '20%',
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
                                                    {col}
                                                </Typography>
                                            </Button>
                                        );
                                    })}
                                </Box>
                            </Box>
                        ))}
                    </Box>
                ) : null}
            </Box>
        </Box>
    );
}

export default MatrixQuestion;
