import { Box, Button, Checkbox, FormControlLabel, Typography } from "@mui/material";

const BarScaleSurvey = ({ question, answer, primaryColor, secondColor, onChange }) => {
    const scale_length = parseInt(question.scale_labels?.length || 5);
    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                    px: 2,
                }}
            >
                {[...Array(parseInt(scale_length || 5)).keys()].map((i) => {
                    const isFirst = i === 0;
                    const isLast = i === parseInt(scale_length || 5) - 1;
                    const ratio = i / (scale_length - 1);
                    const red = Math.round(229 + (67 - 229) * ratio); // 229→67
                    const green = Math.round(57 + (160 - 57) * ratio); // 57→160
                    const blue = Math.round(53 + (71 - 53) * ratio); // 53→71
                    const color = `rgb(${red}, ${green}, ${blue})`;

                    return (
                        <Button
                            key={i}
                            variant="outlined"
                            sx={{
                                minWidth: "50px",
                                width: question.max_scale ? `calc(100% / ${question.max_scale})` : '20%',
                                height: "40px",
                                border: "1px solid",
                                borderColor: color,
                                borderRadius: isFirst ? "20px 0 0 20px" : isLast ? "0 20px 20px 0" : "0",
                                backgroundColor: answer && answer.answer_value >= (question.scale_labels[i] ? question.scale_labels[i].value : i + 1) ? color : 'transparent',
                                color: answer && answer.answer_value >= (question.scale_labels[i] ? question.scale_labels[i].value : i + 1) ? '#fff' : color,

                                "&:hover": {
                                    backgroundColor: color,
                                    color: "#fff",
                                },
                            }}
                            onClick={() => {
                                onChange({
                                    ...question,
                                    answer: {
                                        section_id: question.section_id,
                                        question_id: question.id,
                                        answer_option_id: null,
                                        answer_value: question.scale_labels[i] ? question.scale_labels[i].value : i + 1,
                                        attachment_url: null,
                                        answer_text: null,
                                    }
                                });
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: "12px",
                                }}
                            >
                                {question.scale_labels[i] ? question.scale_labels[i].label : ''}
                            </Typography>
                        </Button>
                    );
                })}
            </Box>
            {question.is_irrelevant && <Box sx={{
                display: "flex",
                flexDirection: "row",
                gap: 4,
                ml: 4,
            }}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={false}
                            onChange={() => { }}
                        />
                    }
                    label={question.irrelevant_text || "ไม่ประสงค์ตอบ"}
                />
            </Box>}
        </>
    );
}
export default BarScaleSurvey;