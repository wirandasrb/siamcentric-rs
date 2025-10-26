import React from "react";
import { Box, Button, Radio, Typography } from "@mui/material";

const MatrixQuestionSurvey = ({ question, answers = [], handleAnswerChange }) => {
  // MatrixQuestionSurvey.js
  const handleSelect = (row, col) => {
    const updatedAnswer = {
      section_id: question.section_id,
      question_id: question.id,
      matrix_row_id: row.id,
      answer_option_id: null,
      answer_value: col.column_value !== "N/A" ? Number(col.column_value) : null,
      answer_text: col.column_value === "N/A" ? col.column_label : null,
    };

    // filter เฉพาะ row เดิมของ question นี้
    const filtered = answers.filter((ans) => ans.matrix_row_id !== row.id);

    handleAnswerChange([...filtered, updatedAnswer]);
  };


  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {question?.matrix_type === "single_choice" && (
        <Box sx={{ border: "1px solid #ddd", borderRadius: 2, overflow: "hidden", p: 2 }}>
          {/* Header */}
          <Box
            sx={{
              display: { xs: "none", sm: "grid" },
              gridTemplateColumns: `150px repeat(${question.matrix_columns.length}, 1fr)`,
              borderBottom: "1px solid #ddd",
              pb: 1,
              mb: 1,
            }}
          >
            <Typography variant="body2" sx={{ textAlign: "center", fontWeight: 500, color: "text.secondary" }}>คำถาม</Typography>
            {question.matrix_columns.map((col) => (
              <Typography key={col.id} variant="body2" sx={{ textAlign: "center", fontWeight: 500, color: "text.secondary" }}>
                {col.column_label}
              </Typography>
            ))}
          </Box>

          {/* Rows */}
          {question.matrix_rows.map((row) => (
            <Box
              key={row.id}
              sx={{
                display: { xs: "flex", sm: "grid" },
                flexDirection: { xs: "column", sm: "row" },
                gridTemplateColumns: { sm: `150px repeat(${question.matrix_columns.length}, 1fr)` },
                alignItems: { sm: "center" },
                gap: { xs: 1, sm: 0 },
                py: 1,
                borderBottom: "1px solid #eee",
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500, mb: { xs: 0.5, sm: 0 } }}>
                {row.row_label}
              </Typography>

              {question.matrix_columns.map((col) => (
                <Box key={col.id} sx={{ display: "flex", alignItems: "center", justifyContent: { xs: "flex-start", sm: "center" }, pl: { xs: 2, sm: 0 } }}>
                  <Radio
                    size="small"
                    color="primary"
                    checked={Boolean(
                      answers.find(
                        (ans) =>
                          ans.question_id === question.id &&
                          ans.matrix_row_id === row.id &&
                          ((col.column_value === "N/A" && ans.answer_text === col.column_label) ||
                            Number(ans.answer_value) === Number(col.column_value))
                      )
                    )}
                    onChange={() => handleSelect(row, col)}
                  />
                  <Typography sx={{ display: { xs: "inline", sm: "none" }, ml: 1, color: "text.secondary" }}>
                    {col.column_label}
                  </Typography>
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      )}

      {question?.matrix_type === "rating_bar" && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {question.matrix_rows.map((row) => {
            const existingAnswer = answers.find(
              (ans) => ans.question_id === question.id && ans.matrix_row_id === row.id
            );
            return (
              <Box key={row.id} sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography sx={{ fontWeight: 500 }}>{row.row_label}</Typography>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  {question.matrix_columns.map((col, colIndex) => {
                    const isSelected = existingAnswer && Number(existingAnswer.answer_value) >= Number(col.column_value);
                    const ratio = colIndex / (question.matrix_columns.length - 1);
                    const color = `rgb(${Math.round(229 + (67 - 229) * ratio)}, ${Math.round(57 + (160 - 57) * ratio)}, ${Math.round(53 + (71 - 53) * ratio)})`;

                    return (
                      <Button
                        key={col.id}
                        variant="outlined"
                        size="small"
                        sx={{
                          minWidth: 50,
                          width: `calc(100% / ${question.matrix_columns.length})`,
                          height: 40,
                          borderColor: color,
                          color: isSelected ? "#fff" : color,
                          backgroundColor: isSelected ? color : "transparent",
                          borderRadius: colIndex === 0 ? "20px 0 0 20px" : colIndex === question.matrix_columns.length - 1 ? "0 20px 20px 0" : "0",
                          "&:hover": { backgroundColor: color, color: "#fff" },
                        }}
                        onClick={() => handleSelect(row, col)}
                      >
                        {col.column_label}
                      </Button>
                    );
                  })}
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default MatrixQuestionSurvey;
