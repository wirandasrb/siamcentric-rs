import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  lighten,
} from "@mui/material";

const BarScaleSurvey = ({
  question,
  answer,
  primaryColor,
  secondColor,
  onChange,
}) => {
  // กำหนดจำนวนสเกล (default เป็น 5)
  const minScale = Number(question.min_scale ?? 1);
  const maxScale = Number(question.max_scale ?? 5);

  const scaleValues = Array.from(
    { length: Math.max(0, maxScale - minScale + 1) },
    (_, i) => minScale + i
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* ส่วนของกล่องคะแนน */}
      {/* <Box
        sx={{
          display: "flex",
          justifyContent: "space-between", // กระจายกล่องให้เต็มความกว้าง
          alignItems: "center",
          gap: { xs: 1, sm: 2 },
          px: { xs: 0, md: 2 },
        }}
      > */}
      {/* <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(4, minmax(0, 1fr))",
            sm: "repeat(5, minmax(0, 1fr))",
            md: `repeat(${scaleValues.length}, minmax(0, 1fr))`,
          },
          gap: { xs: 1, sm: 1.5, md: 2 },
          px: { xs: 0, md: 2 },
        }}
      > */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: { xs: 1, sm: 1.5, md: 2 },
          px: { xs: 0, md: 2 },
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {scaleValues.map((currentVal) => {
          const currentLabel =
            question.scale_labels?.find(
              (item) => item && Number(item.value) === currentVal
            )?.label ?? "";

          const isSelected =
            answer && Number(answer.answer_value) === currentVal;

          return (
            <Box
              key={currentVal}
              onClick={() => {
                onChange({
                  ...question,
                  answer: {
                    section_id: question.section_id,
                    question_id: question.id,
                    answer_option_id: null,
                    answer_value: currentVal,
                    attachment_url: null,
                    answer_text: null,
                  },
                });
              }}
              sx={{
                flex: 1,
                aspectRatio: "1/1", // ทำให้เป็นสี่เหลี่ยมจตุรัส
                maxWidth: 100,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                borderRadius: 3,
                border: isSelected ? "none" : "1px solid #eee",
                backgroundColor: isSelected ? "transparent" : "#fff",
                // ใช้ Gradient สีตามที่กำหนดใน primaryColor
                backgroundImage: isSelected
                  ? `linear-gradient(135deg, ${primaryColor} 0%, ${lighten(
                      primaryColor,
                      0.3
                    )} 100%)`
                  : "none",
                boxShadow: isSelected
                  ? `0 10px 20px ${lighten(primaryColor, 0.6)}`
                  : "none",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  borderColor: primaryColor,
                },
              }}
              //   sx={{
              //     width: { xs: "calc(25% - 6px)", sm: 85, md: 95 },
              //     height: { xs: 85, sm: 95, md: 100 },
              //     flexShrink: 0,
              //     boxSizing: "border-box",

              //     display: "flex",
              //     flexDirection: "column",
              //     alignItems: "center",
              //     justifyContent: "center",

              //     cursor: "pointer",
              //     borderRadius: 3,
              //     border: "1px solid",
              //     borderColor: isSelected ? "transparent" : "#eee",
              //     backgroundColor: isSelected ? "transparent" : "#fff",

              //     backgroundImage: isSelected
              //       ? `linear-gradient(135deg, ${primaryColor} 0%, ${lighten(
              //           primaryColor,
              //           0.3
              //         )} 100%)`
              //       : "none",

              //     boxShadow: isSelected
              //       ? `0 10px 20px ${lighten(primaryColor, 0.6)}`
              //       : "none",

              //     transition: "all 0.3s ease",

              //     "@media (hover: hover)": {
              //       "&:hover": {
              //         transform: "translateY(-2px)",
              //         borderColor: primaryColor,
              //       },
              //     },
              //   }}
            >
              {/* ตัวเลขคะแนน */}
              <Typography
                sx={{
                  fontSize: { xs: 18, sm: 24 },
                  fontWeight: 800,
                  color: isSelected ? "#fff" : "#ccc",
                }}
              >
                {currentVal}
              </Typography>

              {/* คำอธิบายสเกล (ถ้ามี) */}
              {currentLabel && (
                <Typography
                  sx={{
                    fontSize: 10,
                    fontWeight: 500,
                    color: isSelected ? "rgba(255,255,255,0.8)" : "#999",
                    mt: 0.5,
                    textAlign: "center",
                    px: 0.5,
                  }}
                >
                  {currentLabel}
                </Typography>
              )}
            </Box>
          );
        })}
      </Box>

      {/* ส่วนของ "ไม่ประสงค์ตอบ" (Irrelevant) */}
      {question.is_irrelevant && (
        <Box sx={{ display: "flex", justifyContent: "flex-start", ml: 1 }}>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={answer?.answer_value === "irrelevant"}
                onChange={(e) => {
                  onChange({
                    ...question,
                    answer: e.target.checked
                      ? {
                          section_id: question.section_id,
                          question_id: question.id,
                          answer_value: "irrelevant",
                          answer_text:
                            question.irrelevant_text || "ไม่ประสงค์ตอบ",
                        }
                      : null,
                  });
                }}
                sx={{
                  color: "#ccc",
                  "&.Mui-checked": { color: primaryColor },
                }}
              />
            }
            label={
              <Typography sx={{ fontSize: 14, color: "#666" }}>
                {question.irrelevant_text || "ไม่ประสงค์ตอบ"}
              </Typography>
            }
          />
        </Box>
      )}
    </Box>
  );
};

export default BarScaleSurvey;
