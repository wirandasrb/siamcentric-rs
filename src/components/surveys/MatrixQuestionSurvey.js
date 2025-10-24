import { Box, Button, Radio, Typography } from "@mui/material";

const MatrixQuestionSurvey = ({ question, answers, handleAnswerChange }) => {
  console.log(
    "Rendering MatrixQuestionSurvey with question:",
    question,
    "and answers:",
    answers
  );

  const handleSelect = (row, col) => {
    if (question.matrix_type === "single_choice") {
      // ถ้าเลือก N/A
    }
    const updatedAnswer = {
      section_id: question.section_id,
      question_id: question.id,
      matrix_row_id: row.id,
      answer_option_id: null,
      answer_value:
        col.column_value !== "N/A" ? Number(col.column_value) : null,
      answer_text: col.column_value === "N/A" ? col.column_label : null,
    };

    // รวมเข้ากับคำตอบเดิม (แต่แทนเฉพาะ row เดิม)
    const filtered = answers.filter(
      (ans) =>
        !(ans?.question_id === question.id && ans?.matrix_row_id === row.id)
    );

    const newAnswers = [...filtered, updatedAnswer];

    // ส่งออกเป็น array เสมอ
    handleAnswerChange(newAnswers);
  };

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
            overflow: "hidden",
            width: "100%",
            p: 2,
          }}
        >
          {/* Header เฉพาะ Desktop */}
          <Box
            sx={{
              display: { xs: "none", sm: "grid" },
              gridTemplateColumns: `150px repeat(${question.matrix_columns.length}, 1fr)`,
              borderBottom: "1px solid #ddd",
              pb: 1,
              mb: 1,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                textAlign: "center",
                fontWeight: 500,
                color: "text.secondary",
              }}
            >
              คำถาม
            </Typography>
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

          {/* แถวคำถาม */}
          {question.matrix_rows.map((row, rowIndex) => (
            <Box
              key={rowIndex}
              sx={{
                display: {
                  xs: "flex", // มือถือแนวตั้ง
                  sm: "grid", // เดสก์ท็อปเป็นตาราง
                },
                flexDirection: { xs: "column", sm: "row" },
                gridTemplateColumns: {
                  sm: `150px repeat(${question.matrix_columns.length}, 1fr)`,
                },
                alignItems: { sm: "center" },
                gap: { xs: 1, sm: 0 },
                py: 1,
                borderBottom:
                  rowIndex < question.matrix_rows.length - 1
                    ? "1px solid #eee"
                    : "none",
              }}
            >
              {/* label ของ row */}
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  mb: { xs: 0.5, sm: 0 },
                }}
              >
                {row.row_label}
              </Typography>

              {/* options */}
              {question.matrix_columns.map((col, colIndex) => (
                <Box
                  key={colIndex}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: { xs: "flex-start", sm: "center" },
                    pl: { xs: 2, sm: 0 },
                  }}
                >
                  {/* ✅ มือถือ: radio ก่อน, label หลัง */}
                  <Radio
                    size="small"
                    color="primary"
                    onChange={() => handleSelect(row, col)}
                    checked={
                      !!answers.find(
                        (ans) =>
                          ans?.question_id === question.id &&
                          ans.matrix_row_id === row.id &&
                          (col.column_value !== "N/A"
                            ? Number(ans.answer_value) ===
                              Number(col.column_value)
                            : ans.answer_text === col.column_label)
                      )
                    }
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      display: { xs: "inline", sm: "none" },
                      ml: 1,
                      color: "text.secondary",
                    }}
                  >
                    {col.column_label}
                  </Typography>
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
            <Box
              key={rowIndex}
              sx={{ display: "flex", flexDirection: "column", gap: 1 }}
            >
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
                  const isLast =
                    colIndex === question.matrix_columns.length - 1;
                  const existingAnswer = answers.find(
                    (ans) =>
                      ans?.question_id === question.id &&
                      ans.matrix_row_id === row.id
                  );
                  const isSelected =
                    existingAnswer &&
                    Number(existingAnswer.answer_value) >=
                      Number(col.column_value);

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
                        color: isSelected ? "#fff" : color,
                        backgroundColor: isSelected ? color : "transparent",
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
                      onClick={() => handleSelect(row, col)}
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
