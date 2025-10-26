import { Box, Typography } from "@mui/material";
import { ratingTypes } from "../../contants/ratingTypes";

const RatingQuestionSurvey = ({ question, answers, onChange }) => {
    const selectedValue = answers?.[question.id]?.answer_value || 0;
    const ratingType = ratingTypes.find(r => r.id === question.vote_type_id);

    return (
        <Box
            sx={{
                fontSize: 16,
                color: "text.secondary",
                display: "flex",
                flexDirection: "column",
                gap: 1,
                alignItems: "center",
                mb: 2,
                mt: 2,
            }}
        >
            {/* บรรทัดตัวเลข */}
            <Box sx={{ display: "flex", flexDirection: "row" }}>
                {[...Array(parseInt(question.max_scale || 5)).keys()].map((i) => (
                    <Box key={i} sx={{ minWidth: 60, textAlign: "center" }}>
                        <Typography sx={{ fontSize: 16 }} color="textSecondary">
                            {i + 1}
                        </Typography>
                    </Box>
                ))}
            </Box>

            {/* บรรทัด icon */}
            <Box sx={{ display: "flex", flexDirection: "row" }}>
                {[...Array(parseInt(question.max_scale || 5)).keys()].map((i) => {
                    const isFilled = i < selectedValue;
                    const IconToShow = isFilled
                        ? ratingType?.icon
                        : ratingType?.iconDefault;

                    return (
                        <Box
                            key={i}
                            onClick={() => {
                                const newValue = i + 1;
                                onChange({
                                    ...question,
                                    answer: {
                                        section_id: question.section_id,
                                        question_id: question.id,
                                        answer_option_id: null,
                                        answer_text: "",
                                        answer_value: newValue,
                                        attachment_url: null,
                                    },
                                });
                            }}
                            sx={{
                                minWidth: 60,
                                textAlign: "center",
                                cursor: "pointer",
                                transition: "transform 0.15s ease",
                                color: isFilled ? ratingType?.color || "black" : "gray",
                                "&:hover": {
                                    transform: "scale(1.15)",
                                    color: ratingType?.color || "black",
                                },
                            }}
                        >
                            {IconToShow}
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
};

export default RatingQuestionSurvey;
