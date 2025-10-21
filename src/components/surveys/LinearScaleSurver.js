import { Box, FormControl, Radio, RadioGroup, Typography } from "@mui/material";

const LinearScaleSurvey = ({
    question,
    answer,
    onChange,
    primaryColor,
    secondColor,
    orientation = "horizontal",
}) => {
    const minScale = Number(question.min_scale ?? 0);
    const maxScale = Number(question.max_scale ?? 5);

    const scaleOptions = Array.from({ length: maxScale - minScale + 1 }, (_, i) => i + minScale);

    const handleScaleChange = (val) => {
        onChange({
            ...question,
            answer: {
                section_id: question.section_id,
                question_id: question.id,
                answer_option_id: null,
                answer_value: val,
                answer_text: null,
            },
        });
    };

    const handleIrrelevantChange = () => {
        onChange({
            ...question,
            answer: {
                section_id: question.section_id,
                question_id: question.id,
                answer_option_id: null,
                answer_value: null,
                answer_text: question.irrelevant_text || "N/A",
            },
        });
    };

    const isHorizontal = orientation === "horizontal";

    const allOptions = question.is_irrelevant
        ? [...scaleOptions, question.irrelevant_text || "N/A"]
        : scaleOptions;

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: isHorizontal ? "row" : "column",
                alignItems: "center",
                width: "100%",
                gap: 2,
            }}
        >
            {isHorizontal && <Typography>{question.min_label || ""}</Typography>}

            <FormControl sx={{ flex: 1 }}>
                <RadioGroup row={isHorizontal} sx={{ width: "100%" }}>
                    {allOptions.map((val, idx) => {
                        const isNumber = typeof val === "number";
                        const checked = isNumber
                            ? Number(answer?.answer_value) === val
                            : answer?.answer_text === val;
                        return (
                            <Box
                                key={idx}
                                sx={{
                                    flex: 1,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                            >
                                <Typography sx={{ fontSize: 16, color: "textSecondary" }}>
                                    {val}
                                </Typography>
                                <Radio
                                    value={val}
                                    checked={checked}
                                    onChange={() => (isNumber ? handleScaleChange(val) : handleIrrelevantChange())}
                                    sx={{
                                        color: secondColor,
                                        "&.Mui-checked": {
                                            color: primaryColor,
                                        },
                                        p: 0, // ลบ padding
                                        m: 0, // ลบ margin
                                        mt: 0.5,
                                    }}
                                />
                            </Box>
                        );
                    })}
                </RadioGroup>
            </FormControl>

            {isHorizontal && <Typography>{question.max_label || ""}</Typography>}
        </Box>
    );
};

export default LinearScaleSurvey;
