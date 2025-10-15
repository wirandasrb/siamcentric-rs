import { Box, Button, Radio, Typography } from "@mui/material";

const MatrixQuestionSurvey = ({ question, answers, handleAnswerChange }) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
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
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: `150px repeat(${question.matrix_columns.length}, 1fr)`,
                            borderBottom: "1px solid #ddd",
                            pb: 1,
                            mb: 1,
                        }}
                    >
                        {question.matrix_columns.map((col, colIndex) => (
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

                    {question.matrix_rows.map((row, rowIndex) => (
                        <Box
                            key={rowIndex}
                            sx={{
                                display: "grid",
                                gridTemplateColumns: `150px repeat(${question.matrix_columns.length}, 1fr)`,
                                alignItems: "center",
                                py: 1,
                                borderBottom:
                                    rowIndex < question.matrix_rows.length - 1
                                        ? "1px solid #eee"
                                        : "none",
                            }}
                        >
                            <Typography sx={{ fontWeight: 500 }}>
                                {row.row_label}
                            </Typography>
                            {question.matrix_columns.map((col, colIndex) => (
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
                    {question.matrix_rows.map((row, rowIndex) => (
                        <Box key={rowIndex} sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            <Typography sx={{ fontWeight: 500 }}>
                                {`${row.order}. ${row.row_label}`}
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
                                {question.matrix_columns.map((col, colIndex) => {
                                    const isFirst = colIndex === 0;
                                    const isLast = colIndex === question.matrix_columns.length - 1;

                                    // ไล่เฉดสีจากแดง -> เหลือง -> เขียว
                                    const ratio = colIndex / (question.matrix_columns.length - 1);
                                    const red = Math.round(229 + (67 - 229) * ratio); // 229→67
                                    const green = Math.round(57 + (160 - 57) * ratio); // 57→160
                                    const blue = Math.round(53 + (71 - 53) * ratio); // 53→71
                                    const color = `rgb(${red}, ${green}, ${blue})`;

                                    return (
                                        <Button
                                            key={colIndex}
                                            variant="outlined"
                                            size="small"
                                            sx={{
                                                minWidth: "50px",
                                                width: question.matrix_columns
                                                    ? `calc(100% / ${question.matrix_columns.length})`
                                                    : "20%",
                                                height: "40px",
                                                border: "1px solid",
                                                borderColor: color,
                                                color: color,
                                                borderRadius: isFirst
                                                    ? "20px 0 0 20px"
                                                    : isLast
                                                        ? "0 20px 20px 0"
                                                        : "0",
                                                "&:hover": {
                                                    backgroundColor: color,
                                                    color: "#fff",
                                                },
                                            }}
                                        >
                                            <Typography sx={{ fontSize: "12px" }}>
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
    );
};

export default MatrixQuestionSurvey;
