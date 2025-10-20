import React, { useState } from "react";
import { TextField } from "@mui/material";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const TimePickerSurvey = ({
    question,
    answer,
    onChange,
    primaryColor,
    secondColor,
    width = "300px",
}) => {
    const [open, setOpen] = useState(false);

    const value =
        answer?.answer_text && dayjs(answer.answer_text, "HH:mm").isValid()
            ? dayjs(answer.answer_text, "HH:mm")
            : null;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
                label={question.question}
                value={value}
                onChange={(newValue) => {
                    onChange({
                        ...question,
                        answer: {
                            section_id: question.section_id,
                            question_id: question.id,
                            answer_option_id: null,
                            answer_value: null,
                            attachment_url: null,
                            answer_text: newValue ? newValue.format("HH:mm") : null,
                        },
                    });
                }}
                format="HH:mm น."
                open={open} // 👈 ควบคุม popup ด้วย state
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                slotProps={{
                    textField: {
                        size: "small",
                        onClick: () => setOpen(true),
                        InputLabelProps: { shrink: true },
                        sx: {
                            width,
                            '& .MuiInputBase-input': {
                                textAlign: 'center',
                                cursor: 'pointer',
                            },
                            '& .MuiInputLabel-root': {
                                color: primaryColor || 'gray',
                            },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: secondColor || '#ccc',
                                },
                                '&:hover fieldset': {
                                    borderColor: secondColor || '#1976d2',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: secondColor || '#1976d2',
                                },
                            },
                        },
                    },
                }}
            />
        </LocalizationProvider>
    );
};

export default TimePickerSurvey;
