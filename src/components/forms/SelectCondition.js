import { Box, MenuItem, Select } from "@mui/material";

const SelectCondition = ({ questions, option, onChange }) => {
    const currentCondition =
        option.conditions && option.conditions.length > 0
            ? option.conditions[0]
            : null;

    return (
        <Box sx={{ width: 250 }}>
            <Select
                sx={{ height: 40, width: "100%" }}
                value={currentCondition ? currentCondition.target_question_id : ""}
                displayEmpty
                onChange={(e) => {
                    const target_question_id = e.target.value;

                    if (target_question_id === "") {
                        onChange({ ...option, is_have_condition: false, conditions: [] });
                        return;
                    }

                    const newConditions = [
                        {
                            option_id: option.temp_id,
                            condition_type: "skip_question",
                            target_question_id,
                            target_section_id: null,
                            required_option_id: null,
                        },
                    ];

                    onChange({ ...option, is_have_condition: true, conditions: newConditions });
                }}
            >
                <MenuItem value="">ไม่มีเงื่อนไข</MenuItem>
                {questions.map((q) => (
                    <MenuItem key={q.temp_id} value={q.temp_id}>
                        ข้ามไปยังคำถามข้อที่ {q.question_no}
                    </MenuItem>
                ))}
            </Select>
        </Box>
    );
};

export default SelectCondition;
