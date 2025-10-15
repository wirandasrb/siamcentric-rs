import { Autocomplete, Box, Checkbox, FormControlLabel, FormGroup, lighten, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import ExternalSelection from "./ExternalSelection";
import RatingQuestionSurvey from "./RatingQuestionSurvey";
import MatrixQuestionSurvey from "./MatrixQuestionSurvey";
import DatePickerSurvey from "./DatepickerSurvey";

const QuestionSurvey = ({
    question,
    answers,
    primaryColor,
    secondColor,
    onChange,
}) => {
    const answer = answers.find(ans => ans?.question_id === question.id);
    return (
        <Box key={question.id} sx={{ px: 2, width: "100%" }}>
            {question.question_type_id === 9 ?
                <Box sx={{
                    mb: 2,
                    backgroundColor: secondColor,
                    p: 2,
                    borderRadius: 2,
                    borderLeft: `4px solid ${primaryColor}`
                }}>
                    <Typography
                        sx={{
                            fontSize: 16,
                            fontWeight: 700,
                        }}
                    >
                        {question.question_no}. {question.question}
                    </Typography>
                </Box>
                : <Typography
                    sx={{
                        fontSize: 16,
                        fontWeight: 600,
                        mb: 2
                    }}
                >
                    {question.question_no}. {question.question}
                </Typography>}
            <Box
                sx={{
                    ml: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    mb: 2,
                }}
            >
                {(question.question_type_id === 1 || question.question_type_id === 2) && (
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
                                }
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
                                            border: isSelected
                                                ? `1px solid ${primaryColor}`
                                                : "none",
                                            borderRadius: 2,
                                            p: 1,
                                            transition: "all 0.2s ease",
                                            backgroundColor: isSelected ? lighten(secondColor, 0.08) : "transparent",
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
                            {question.options.find(option => option.is_other) && (
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
                                            }
                                        });
                                    }}
                                    disabled={!(answer && question.options.find(option => option.is_other && option.id === answer.answer_option_id))}
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
                            {question.options.map((option) => (
                                <FormControlLabel
                                    key={option.id}
                                    control={
                                        <Checkbox
                                            checked={answer ? answer.answer_option_id?.includes(option.id) : false}
                                            onChange={(e) => {
                                                // is_exclusive ถ้าเลือกแล้วจะไม่สามารถเลือกตัวอื่นได้
                                                let updatedOptionIds = answer ? [...(answer.answer_option_id || [])] : [];
                                                if (e.target.checked) {
                                                    // ถ้าเลือก is_exclusive ให้ล้างตัวเลือกอื่นๆ ออก
                                                    if (option.is_exclusive) {
                                                        updatedOptionIds = [option.id];
                                                    }
                                                    else {
                                                        // ถ้าเลือกตัวอื่น ให้ลบ is_exclusive ออก
                                                        updatedOptionIds = updatedOptionIds.filter(id => {
                                                            let opt = question.options.find(o => o.id === id);
                                                            return opt && !opt.is_exclusive;
                                                        });
                                                        updatedOptionIds.push(option.id);
                                                    }
                                                } else {
                                                    updatedOptionIds = updatedOptionIds.filter(id => id !== option.id);
                                                }
                                                let updatedAnswer = {
                                                    section_id: question.section_id,
                                                    question_id: question.id,
                                                    answer_option_id: updatedOptionIds,
                                                    answer_text: "",
                                                    answer_value: null,
                                                    attachment_url: null,
                                                };
                                                onChange({ ...question, answer: updatedAnswer });
                                            }}
                                            disabled={answer && answer.answer_option_id?.includes(option.id) ? false : (answer && answer.answer_option_id?.some(id => {
                                                let opt = question.options.find(o => o.id === id);
                                                return opt && opt.is_exclusive;
                                            }))}
                                        />
                                    }
                                    label={option.option}
                                />
                            ))}
                        </FormGroup>
                        {/* ถ้าคำตอบที่เลือกเป็นอื่นๆ option มีตัวแปร is_other */}
                        {question.options.find(option => option.is_other) && (
                            <TextField
                                value={answer ? answer.answer_text : ""}
                                variant="standard"
                                onChange={(e) => {
                                    onChange({
                                        ...question,
                                        answer: {
                                            ...answer,
                                            answer_text: e.target.value,
                                        }
                                    });
                                }}
                                disabled={!(answer && question.options.find(option => option.is_other && answer.answer_option_id?.includes(option.id)))}
                                placeholder="โปรดระบุ"
                                sx={{ mt: 1 }}
                            />
                        )}
                    </Box>)}

                {question.question_type_id === 5 && (
                    <Box sx={{ mt: 1, ml: 1, width: 300 }}>
                        {/*แบบ autocomplete */}
                        {question.dropdown_source_type && question.dropdown_source_type === "external" ? (
                            <ExternalSelection
                                source_id={question?.external_source_id}
                                value={answer ? answer.answer_option_id : null}
                                onChange={(newValue) => {
                                    let updatedAnswer = {
                                        section_id: question.section_id,
                                        question_id: question.id,
                                        answer_text: newValue ? newValue.label : "",
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
                                value={question?.options?.find(opt => opt.id === (answer ? answer.answer_option_id : null)) || null}
                            />
                        )}
                    </Box>
                )}

                {question.question_type_id === 6 && (
                    <RatingQuestionSurvey question={question} answers={answers} onChange={onChange} />
                )}

                {question.question_type_id === 9 && (
                    <MatrixQuestionSurvey
                        question={question}
                        answers={answers}
                        handleAnswerChange={(updatedAnswers) => {
                            // คำถาม matrix จะมีหลายคำตอบใน answers
                            let filteredAnswers = answers.filter(ans => ans.question_id !== question.id);
                            let newAnswers = [...filteredAnswers, ...updatedAnswers];
                            onChange({
                                ...question,
                                answers: newAnswers,
                            });
                        }}
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

            </Box>
        </Box>
    );
}

export default QuestionSurvey;