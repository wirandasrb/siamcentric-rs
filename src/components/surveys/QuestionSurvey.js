import {
  Autocomplete,
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  lighten,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import ExternalSelection from "./ExternalSelection";
import RatingQuestionSurvey from "./RatingQuestionSurvey";
import MatrixQuestionSurvey from "./MatrixQuestionSurvey";
import DatePickerSurvey from "./DatepickerSurvey";
import TimePickerSurvey from "./TimePrickerSurvey";
import FileUploadSurvey from "./FileUploadSurvey";
import LinearScaleSurvey from "./LinearScaleSurver";
import BarScaleSurvey from "./BarScaleSurvey";

const QuestionSurvey = ({
  question,
  answers,
  primaryColor,
  secondColor,
  onChange,
}) => {
  const answer = answers.find((ans) => ans?.question_id === question.id);

  const handleAnswerChange = (updatedAnswersForThisQuestion) => {
    if (!updatedAnswersForThisQuestion) return;

    const normalized = Array.isArray(updatedAnswersForThisQuestion)
      ? updatedAnswersForThisQuestion.filter(Boolean)
      : [updatedAnswersForThisQuestion].filter(Boolean);

    const otherAnswers = answers.filter(
      (ans) => ans?.question_id !== question.id
    );
    const newAnswers = [...otherAnswers, ...normalized];

    // ✅ ใช้ field เดียวกันคือ `answer`
    onChange({
      ...question,
      answer: newAnswers,
    });
  };

  return (
    <Box key={question.id} sx={{ px: 2, width: "100%" }}>
      {question.question_type_id === 9 ? (
        <Box
          sx={{
            mb: 2,
            backgroundColor: secondColor,
            p: 2,
            borderRadius: 2,
            borderLeft: `4px solid ${primaryColor}`,
          }}
        >
          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            {question.question_no}. {question.question}{" "}
            {question.is_required && <span style={{ color: "red" }}>*</span>}
          </Typography>
        </Box>
      ) : (
        <Typography
          sx={{
            fontSize: 16,
            fontWeight: 600,
            mb: 2,
          }}
        >
          {question.question_no}. {question.question}{" "}
          {question.is_required && <span style={{ color: "red" }}>*</span>}
        </Typography>
      )}
      <Box
        sx={{
          ml: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mb: 2,
        }}
      >
        {(question.question_type_id === 1 ||
          question.question_type_id === 2) && (
          <TextField
            fullWidth
            multiline={question.question_type_id === 2}
            minRows={question.question_type_id === 2 ? 4 : 1}
            value={question.answer || ""}
            onChange={(e) => {
              onChange({
                ...question,
                answer: {
                  section_id: question.section_id,
                  question_id: question.id,
                  answer_option_id: null,
                  answer_value: null,
                  attachment_url: null,
                  answer_text: e.target.value,
                },
              });
            }}
            placeholder="พิมพ์คำตอบที่นี่"
            sx={{ mt: 1 }}
          />
        )}

        {question.question_type_id === 3 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              mt: 1,
              fontSize: 16,
            }}
          >
            <RadioGroup
              value={answer ? answer.answer_option_id : ""}
              onChange={(e) => {
                let selectedOptionId = parseInt(e.target.value);
                let updatedAnswer = {
                  section_id: question.section_id,
                  question_id: question.id,
                  answer_option_id: selectedOptionId,
                  answer_text: "",
                  answer_value: null,
                  attachment_url: null,
                };
                onChange({ ...question, answer: updatedAnswer });
              }}
            >
              {question.options.map((option) => {
                const isSelected = answer?.answer_option_id === option.id;

                return (
                  <Box
                    key={option.id}
                    sx={{
                      border: isSelected ? `1px solid ${primaryColor}` : "none",
                      borderRadius: 2,
                      p: 1,
                      transition: "all 0.2s ease",
                      backgroundColor: isSelected
                        ? lighten(secondColor, 0.08)
                        : "transparent",
                      "&:hover": {
                        borderColor: primaryColor,
                        backgroundColor: lighten(secondColor, 0.03),
                      },
                      mb: 1,
                    }}
                  >
                    <FormControlLabel
                      control={<Radio />}
                      label={option.option}
                      value={option.id}
                      sx={{
                        width: "100%",
                        m: 0,
                        "& .MuiFormControlLabel-label": {
                          fontSize: 16,
                          color: isSelected ? primaryColor : "inherit",
                          fontWeight: isSelected ? "bold" : "normal",
                        },
                      }}
                    />
                  </Box>
                );
              })}
              {/* ถ้าคำตอบที่เลือกเป็นอื่นๆ option มีตัวแปร is_other */}
              {question.options.find((option) => option.is_other) && (
                <TextField
                  fullWidth
                  variant="standard"
                  value={answer?.answer_text || ""}
                  onChange={(e) => {
                    onChange({
                      ...question,
                      answer: {
                        ...answer,
                        answer_text: e.target.value,
                      },
                    });
                  }}
                  disabled={
                    !(
                      answer &&
                      question.options.find(
                        (option) =>
                          option.is_other &&
                          option.id === answer.answer_option_id
                      )
                    )
                  }
                  placeholder="โปรดระบุ"
                  sx={{ mt: 1, mb: 2, ml: 4 }}
                />
              )}
            </RadioGroup>
          </Box>
        )}

        {question.question_type_id === 4 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 1,
              fontSize: 14,
            }}
          >
            <FormGroup>
              {question.options.map((option) => {
                const isChecked =
                  answer?.answer_option_id?.includes(option.id) || false;

                return (
                  <Box
                    key={option.id}
                    sx={{
                      border: isChecked ? `1px solid ${primaryColor}` : "none",
                      borderRadius: 2,
                      p: 1,
                      transition: "all 0.2s ease",
                      backgroundColor: isChecked
                        ? lighten(secondColor, 0.08)
                        : "transparent",
                      "&:hover": {
                        borderColor: primaryColor,
                        backgroundColor: lighten(secondColor, 0.03),
                      },
                      mb: 1,
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isChecked}
                          onChange={(e) => {
                            let updatedOptionIds = answer
                              ? [...(answer.answer_option_id || [])]
                              : [];
                            if (e.target.checked) {
                              if (option.is_exclusive) {
                                updatedOptionIds = [option.id];
                              } else {
                                updatedOptionIds = updatedOptionIds.filter(
                                  (id) => {
                                    const opt = question.options.find(
                                      (o) => o.id === id
                                    );
                                    return opt && !opt.is_exclusive;
                                  }
                                );
                                updatedOptionIds.push(option.id);
                              }
                            } else {
                              updatedOptionIds = updatedOptionIds.filter(
                                (id) => id !== option.id
                              );
                            }

                            const updatedAnswer = {
                              section_id: question.section_id,
                              question_id: question.id,
                              answer_option_id: updatedOptionIds,
                              answer_text: "",
                              answer_value: null,
                              attachment_url: null,
                            };
                            onChange({ ...question, answer: updatedAnswer });
                          }}
                          disabled={
                            answer &&
                            !answer.answer_option_id?.includes(option.id) &&
                            answer.answer_option_id?.some((id) => {
                              const opt = question.options.find(
                                (o) => o.id === id
                              );
                              return opt && opt.is_exclusive;
                            })
                          }
                        />
                      }
                      label={option.option}
                      sx={{
                        width: "100%",
                        m: 0,
                        "& .MuiFormControlLabel-label": {
                          fontSize: 16,
                          color: isChecked ? primaryColor : "inherit",
                          fontWeight: isChecked ? "bold" : "normal",
                        },
                      }}
                    />
                  </Box>
                );
              })}
            </FormGroup>

            {/* ช่องกรอก "อื่นๆ" */}
            {question.options.find((option) => option.is_other) && (
              <TextField
                value={answer ? answer.answer_text : ""}
                variant="standard"
                onChange={(e) => {
                  onChange({
                    ...question,
                    answer: {
                      ...answer,
                      answer_text: e.target.value,
                    },
                  });
                }}
                disabled={
                  !(
                    answer &&
                    question.options.find(
                      (option) =>
                        option.is_other &&
                        answer.answer_option_id?.includes(option.id)
                    )
                  )
                }
                placeholder="โปรดระบุ"
                sx={{ mt: 1, ml: 4 }}
              />
            )}
          </Box>
        )}

        {question.question_type_id === 5 && (
          <Box sx={{ mt: 1, ml: 1, width: 300 }}>
            {/*แบบ autocomplete */}
            {question.dropdown_source_type &&
            question.dropdown_source_type === "external" ? (
              <ExternalSelection
                source_id={question?.external_source_id}
                value={answer ? answer.answer_text : null}
                onChange={(newValue) => {
                  let updatedAnswer = {
                    section_id: question.section_id,
                    question_id: question.id,
                    answer_text: newValue ? newValue : "",
                    answer_option_id: null,
                    answer_value: null,
                    attachment_url: null,
                  };
                  onChange({
                    ...question,
                    answer: updatedAnswer,
                  });
                }}
              />
            ) : (
              <Autocomplete
                options={question.options || []}
                getOptionLabel={(option) => option.option}
                value={
                  question?.options?.find(
                    (opt) =>
                      opt.id === (answer ? answer.answer_option_id : null)
                  ) || null
                }
              />
            )}
          </Box>
        )}

        {question.question_type_id === 6 && (
          <RatingQuestionSurvey
            question={question}
            answers={answers}
            onChange={onChange}
          />
        )}

        {question.question_type_id === 7 && (
          <LinearScaleSurvey
            question={question}
            answer={answer}
            onChange={(updatedQuestion) => {
              onChange(updatedQuestion);
            }}
            primaryColor={primaryColor}
            secondColor={secondColor}
          />
        )}

        {question.question_type_id === 8 && (
          <BarScaleSurvey
            question={question}
            answer={answer}
            onChange={(updatedQuestion) => {
              onChange(updatedQuestion);
            }}
            primaryColor={primaryColor}
            secondColor={secondColor}
          />
        )}

        {question.question_type_id === 9 && (
          <MatrixQuestionSurvey
            question={question}
            answers={answers || []}
            handleAnswerChange={handleAnswerChange}
          />
        )}

        {/* file upload */}
        {question.question_type_id === 10 && (
          <FileUploadSurvey
            question={question}
            answer={answer}
            onChange={(updatedQuestion) => {
              onChange(updatedQuestion);
            }}
            primaryColor={primaryColor}
            secondColor={secondColor}
          />
        )}

        {/* Date*/}
        {question.question_type_id === 11 && (
          <DatePickerSurvey
            question={question}
            answer={answer}
            onChange={(updatedQuestion) => {
              onChange(updatedQuestion);
            }}
            primaryColor={primaryColor}
            secondColor={secondColor}
          />
        )}

        {/* Time */}
        {question.question_type_id === 12 && (
          <Box sx={{ ml: 1 }}>
            <TimePickerSurvey
              question={question}
              answer={answer}
              onChange={(updatedQuestion) => {
                onChange(updatedQuestion);
              }}
              primaryColor={primaryColor}
              secondColor={secondColor}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default QuestionSurvey;
