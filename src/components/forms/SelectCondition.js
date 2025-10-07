import { Box, Divider, MenuItem, Select } from "@mui/material";

const SelectCondition = ({ questions, option, onChange, question, sections }) => {
    const currentCondition =
        option.conditions && option.conditions.length > 0
            ? option.conditions[0]
            : null;

    // คำถามถัดไปทั้งหมด (คำถามที่มีหมายเลขมากกว่าคำถามปัจจุบัน)
    const nextQuestions = questions.filter(q => q.question_no > question.question_no);

    // ส่วนถัดไปทั้งหมด (ส่วนที่มีหมายเลขมากกว่าส่วนปัจจุบัน)
    const currentSection = sections.find(s => s.questions.some(q => q.temp_id === question.temp_id));
    const nextSections = currentSection
        ? sections
            .filter(s => s.section_no > currentSection.section_no)
        : [];

    return (
        <Box sx={{ width: 250 }}>
            <Select
                sx={{ height: 40, width: "100%" }}
                value={currentCondition ? (currentCondition.target_question_id || currentCondition.target_section_id) : ""}
                displayEmpty
                onChange={(e) => {
                    const targetId = e.target.value;

                    if (targetId === "") {
                        // ถ้าเลือก "ไม่มีเงื่อนไข"
                        onChange({ ...option, is_have_condition: false, conditions: [] });
                        return;
                    }

                    let newConditions = [];

                    // ตรวจสอบว่า targetId เป็น question หรือ section
                    const targetQuestion = questions.find(q => q.temp_id === targetId);
                    if (targetQuestion) {
                        // skip_question
                        newConditions = [
                            {
                                option_id: option.temp_id,
                                condition_type: "skip_question",
                                target_question_id: targetId,
                                target_section_id: null,
                                required_option_id: null,
                            }
                        ];
                    } else {
                        // skip_section
                        newConditions = [
                            {
                                option_id: option.temp_id,
                                condition_type: "skip_section",
                                target_question_id: null,
                                target_section_id: targetId,
                                required_option_id: null,
                            }
                        ];
                    }

                    onChange({ ...option, is_have_condition: true, conditions: newConditions });
                }}
            >
                <MenuItem value="">ไม่มีเงื่อนไข</MenuItem>
                {nextQuestions.length > 0 && [
                    <Divider key="divider-questions" />,
                    ...nextQuestions.map((q) => (
                        <MenuItem key={q.temp_id} value={q.temp_id}>
                            ข้ามไปยังคำถามที่ {q.question_no}
                        </MenuItem>
                    )),
                ]}
                {nextSections.length > 0 && [
                    <Divider key="divider-sections" />,
                    ...nextSections.map((s) => (
                        <MenuItem key={s.temp_id} value={s.temp_id}>
                            ข้ามไปยังส่วนที่ {s.section_no}
                        </MenuItem>
                    )),
                ]}
            </Select>
        </Box>
    );
};

export default SelectCondition;
