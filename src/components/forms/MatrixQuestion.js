"use client";
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
import { useEffect, useState } from "react";

const matrixOptions = [
    { value: "single_choice", label: "ตัวเลือกเดี่ยว", icon: <CircleOutlined /> },
    { value: "rating_bar", label: "การให้คะแนน", icon: <PowerInput /> },
];

const MatrixQuestion = ({ question, onChange }) => {
    // ใช้ state ภายในเพื่อควบคุม row/column list
    const [rows, setRows] = useState(() => {
        return question?.matrix_rows?.length
            ? question.matrix_rows.map(r => ({ id: r.id || "", row_label: r.row_label, order: r.order || 1 }))
            : [{ id: "", row_label: "แถวที่ 1", order: 1 }];
    });

    const [columns, setColumns] = useState(() => {
        return question?.matrix_columns?.length
            ? question.matrix_columns.map(c => ({ id: c.id || "", column_label: c.column_label, column_value: c.column_value || 1, order: c.order || 1 }))
            : [{ id: "", column_label: "คอลัมน์ที่ 1", column_value: 1, order: 1 }];
    });

    // เพิ่ม/ลบแถว
    const addRow = () => setRows([...rows, {
        id: "",
        row_label: `แถวที่ ${rows.length + 1}`,
        order: rows.length + 1
    }]);
    const removeRow = (index) => setRows(rows.filter((_, i) => i !== index));

    // เพิ่ม/ลบคอลัมน์

    // เพิ่มคอลัมน์ปกติ แต่ถ้ามีคอลัมน์ N/A อยู่แล้ว จะเพิ่มแทรกหน้า N/A
    const addColumn = () => {
        const naIndex = columns.findIndex(col => col.column_value === "N/A");
        if (naIndex !== -1) {
            // ถ้ามีคอลัมน์ N/A อยู่แล้ว จะเพิ่มแทรกหน้า N/A
            setColumns([...columns.slice(0, naIndex), {
                id: "",
                column_label: `คอลัมน์ที่ ${columns.length + 1}`,
                column_value: columns.length + 1,
                order: columns.length + 1
            }, ...columns.slice(naIndex)]);
        } else {
            // ถ้าไม่มีคอลัมน์ N/A ให้เพิ่มคอลัมน์ปกติ
            setColumns([...columns, {
                id: "",
                column_label: `คอลัมน์ที่ ${columns.length + 1}`,
                column_value: columns.length + 1,
                order: columns.length + 1
            }]);
        }
    };

    const addColumnNA = () =>
        setColumns([...columns, {
            id: "",
            column_label: "N/A",
            column_value: "N/A",
            order: columns.length + 1
        }]);

    const removeColumn = (index) =>
        setColumns(columns.filter((_, i) => i !== index));

    // แก้ชื่อแถว/คอลัมน์
    const updateRow = (index, value) => {
        const updated = [...rows];
        updated[index] = { ...updated[index], ...value };
        setRows(updated);
    };

    const updateColumn = (index, value) => {
        const updated = [...columns];
        updated[index] = { ...updated[index], ...value };
        setColumns(updated);
    };

    // เมื่อ rows หรือ columns เปลี่ยน ให้แจ้ง parent component ด้วย
    useEffect(() => {
        // matrix_rows และ matrix_columns จะเก็บเป็น array
        // rows = [{ row_label: "แถวที่ 1", order: 1 }, { row_label: "แถวที่ 2", order: 2 }, ...]
        // columns = [{ column_label: "คอลัมน์ที่ 1", column_value: 1, order: 1 }, ...]
        if (!onChange) return;
        if (rows.length > 0 && columns.length > 0) {
            // ถ้ามี id ให้เก็บ id ด้วย (กรณีแก้ไขคำถามที่มีอยู่แล้ว) 
            // ถ้าเป็นแถว/คอลัมน์ ใหม่ ให้ id เป็น "" (backend จะสร้าง id ใหม่ให้)
            const rowsData = rows.map((row) => ({ id: row.id, row_label: row.row_label, order: row.order }));
            const columnsData = columns.map((col, index) => ({ id: col.id, column_label: col.column_label, column_value: col.column_value, order: index + 1 }));
            onChange({ ...question, matrix_rows: rowsData, matrix_columns: columnsData });
        }

    }, [rows, columns]);

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
                    value={question?.matrix_type || "single_choice"}
                    onChange={(e) => onChange({ matrix_type: e.target.value })}
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
                                    value={row.row_label}
                                    onChange={(e) => updateRow(index, { row_label: e.target.value })}
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
                                    value={col.column_label}
                                    onChange={(e) => updateColumn(index, { column_label: e.target.value })}
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

                        <Box sx={{ display: 'flex', direction: 'row', gap: 1, alignItems: 'center', mt: 1, alignSelf: "flex-start" }}>
                            <Button
                                startIcon={<Add />}
                                size="small"
                                onClick={addColumn}
                            >
                                เพิ่มคอลัมน์
                            </Button>
                            {question?.matrix_type === "single_choice" && (
                                <>
                                    <Typography variant="caption" color="textSecondary" sx={{ ml: 2 }}>
                                        หรือ
                                    </Typography>
                                    <Button
                                        startIcon={<Add />}
                                        size="small"
                                        onClick={addColumnNA}
                                        disabled={columns.some(col => col.column_value === "N/A")}
                                    >
                                        เพิ่มคอลัมน์ N/A
                                    </Button>
                                </>
                            )}

                        </Box>
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
                {question?.matrix_type === "single_choice" ? (
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
                                    {col.column_label}
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
                                    {rowIndex + 1}. {row.row_label}
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
                ) : question?.matrix_type === "rating_bar" ? (
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
                                    {rowIndex + 1}. {row.row_label}
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
                                                    {col.column_label}
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
