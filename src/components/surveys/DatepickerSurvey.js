import { Box, lighten, TextField } from "@mui/material";

const DatePickerSurvey = ({
    question,
    answer,
    onChange,
    primaryColor,
    secondColor,
}) => {
    return (
        <Box sx={{ display: "flex", mt: 2, mb: 2, ml: 1 }}>
            <TextField
                type="date"
                label="เลือกวันที่"
                value={answer?.answer_text || ""}
                InputLabelProps={{ shrink: true }}
                onChange={(e) => onChange({
                    ...question,
                    answer: {
                        section_id: question.section_id,
                        question_id: question.id,
                        answer_option_id: null,
                        answer_value: null,
                        attachment_url: null,
                        answer_text: e.target.value,
                    }
                })}
                sx={{
                    width: 300,
                    '& .MuiInputBase-root': {
                        height: 40,
                        backgroundColor: "white",
                        borderRadius: 1,
                        // border: `1px solid ${lighten(primaryColor, 0.4)}`,
                        '&:hover': { borderColor: primaryColor },
                        '&.Mui-focused': { borderColor: primaryColor, boxShadow: `0 0 0 2px ${lighten(primaryColor, 0.7)}` },
                    },
                    '& .MuiInputLabel-root': {
                        color: lighten(primaryColor, 0.4),
                    },
                }}
            />

        </Box>
    );
};

export default DatePickerSurvey;