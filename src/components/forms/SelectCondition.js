// import { Box, Divider, MenuItem, Select } from "@mui/material";

// const SelectCondition = ({ questions, option, onChange, question, sections }) => {
//     const currentCondition =
//         option.conditions && option.conditions.length > 0
//             ? option.conditions[0]
//             : null;

//     // คำถามถัดไปทั้งหมด (คำถามที่มีหมายเลขมากกว่าคำถามปัจจุบัน)
//     const nextQuestions = questions.filter(q => q.question_no > question.question_no);

//     // ส่วนถัดไปทั้งหมด (ส่วนที่มีหมายเลขมากกว่าส่วนปัจจุบัน)
//     const currentSection = sections.find(s => s.questions.some(q => q.temp_id === question.temp_id));
//     const nextSections = currentSection
//         ? sections
//             .filter(s => s.section_no > currentSection.section_no)
//         : [];

//     return (
//         <Box sx={{ width: 250 }}>
//             <Select
//                 sx={{ height: 40, width: "100%" }}
//                 value={currentCondition ? (currentCondition.target_question_id || currentCondition.target_section_id) : ""}
//                 displayEmpty
//                 onChange={(e) => {
//                     const targetId = e.target.value;

//                     if (targetId === "") {
//                         // ถ้าเลือก "ไม่มีเงื่อนไข"
//                         onChange({ ...option, is_have_condition: false, conditions: [] });
//                         return;
//                     }

//                     let newConditions = [];

//                     // ตรวจสอบว่า targetId เป็น question หรือ section
//                     const targetQuestion = questions.find(q => q.temp_id === targetId);
//                     const targetSection = sections.find(s => s.temp_id === targetId);

//                     // ถ้าตอบอันนี้ ต้องตอบคำถามข้อที่ ... (required_question) 
//                     // ถ้าตอบอันนี้ ให้ข้ามไปยังคำถามข้อที่ ... (skip_question)
//                     // ถ้าตอบอันนี้ ให้ข้ามไปยังส่วนที่ ... (skip_section)
//                     if (targetQuestion) {
//                         // skip_question
//                         newConditions = [
//                             {
//                                 option_id: option.temp_id,
//                                 condition_type: "skip_question",
//                                 target_question_id: targetId,
//                                 target_section_id: null,
//                                 required_option_id: null,
//                             }
//                         ];
//                     } else {
//                         // skip_section
//                         newConditions = [
//                             {
//                                 option_id: option.temp_id,
//                                 condition_type: "skip_section",
//                                 target_question_id: null,
//                                 target_section_id: targetId,
//                                 required_option_id: null,
//                             }
//                         ];
//                     }
//                     onChange({ ...option, is_have_condition: true, conditions: newConditions });
//                 }}
//             >
//                 <MenuItem value="">ไม่มีเงื่อนไข</MenuItem>
//                 {/*ถ้าตอบอันนี้ ต้องตอบคำถามข้อที่ ... ด้วย*/}
//                 {nextQuestions.length > 0 && (
//                     <MenuItem disabled>-- ต้องตอบคำถามข้อที่ --</MenuItem>
//                 )}
//                 {nextQuestions.map((q) => (
//                     <MenuItem key={q.temp_id} value={q.temp_id}>
//                         ต้องตอบคำถามที่ {q.question_no}
//                     </MenuItem>
//                 ))}
//                 {/*ถ้าตอบอันนี้ ให้ข้ามไปยังคำถามข้อที่ ... */}
//                 {nextQuestions.length > 0 && [
//                     <Divider key="divider-questions" />,
//                     ...nextQuestions.map((q) => (
//                         <MenuItem key={q.temp_id} value={q.temp_id}>
//                             ข้ามไปยังคำถามที่ {q.question_no}
//                         </MenuItem>
//                     )),
//                 ]}
//                 {/*ถ้าตอบอันนี้ ให้ข้ามไปยังส่วนที่ ... */}
//                 {nextSections.length > 0 && [
//                     <Divider key="divider-sections" />,
//                     ...nextSections.map((s) => (
//                         <MenuItem key={s.temp_id} value={s.temp_id}>
//                             ข้ามไปยังส่วนที่ {s.section_no}
//                         </MenuItem>
//                     )),
//                 ]}
//             </Select>
//         </Box>
//     );
// };

// export default SelectCondition;

import { Box, Divider, MenuItem, Select } from "@mui/material";

const SelectCondition = ({ questions, option, onChange, question, sections }) => {
    const currentCondition = option.conditions?.[0] ?? null;

    // คำถามถัดไปทั้งหมด
    const nextQuestions = questions.filter(q => q.question_no > question.question_no);

    // ส่วนถัดไปทั้งหมด
    const currentSection = sections.find(s => s.questions.some(q => q.temp_id === question.temp_id));
    const nextSections = currentSection
        ? sections.filter(s => s.section_no > currentSection.section_no)
        : [];

    // หา value ที่ Select จะใช้
    const selectValue = (() => {
        if (!currentCondition) return "";
        if (currentCondition.condition_type === "required_question") return `required_question-${currentCondition.target_question_temp_id || currentCondition.target_question_id}`;
        if (currentCondition.condition_type === "skip_question") return `skip_question-${currentCondition.target_question_temp_id || currentCondition.target_question_id}`;
        if (currentCondition.condition_type === "skip_section") return `skip_section-${currentCondition.target_section_temp_id || currentCondition.target_section_id}`;
        return "";
    })();

    const handleChange = (e) => {
        const value = e.target.value;
        if (!value) {
            onChange({ ...option, is_have_condition: false, conditions: [] });
            return;
        }

        const [condition_type, targetId] = value.split("-");
        const newCondition = {
            option_id: option.temp_id,
            condition_type,
            target_question_id: condition_type !== "skip_section" ? targetId : null,
            target_section_id: condition_type === "skip_section" ? targetId : null,
            required_option_id: null,
        };

        onChange({ ...option, is_have_condition: true, conditions: [newCondition] });
    };

    return (
        <Box sx={{ width: 250 }}>
            <Select
                sx={{ height: 40, width: "100%" }}
                value={selectValue}
                displayEmpty
                onChange={(e) => {
                    const value = e.target.value;
                    if (!value) {
                        onChange({ ...option, is_have_condition: false, conditions: [] });
                        return;
                    }

                    const [condition_type, targetId] = (value + "").split("-");
                    const newCondition = {
                        option_id: option.temp_id,
                        condition_type,
                        target_question_id: condition_type !== "skip_section" ? targetId : null,
                        target_section_id: condition_type === "skip_section" ? targetId : null,
                        required_option_id: null,
                    };

                    onChange({ ...option, is_have_condition: true, conditions: [newCondition] });
                }}
            >
                <MenuItem value="">ไม่มีเงื่อนไข</MenuItem>
                {nextQuestions.map((q) => (
                    <MenuItem key={`req-${q.temp_id}`} value={`required_question-${q.temp_id}`}>
                        ต้องตอบคำถามที่ {q.question_no}
                    </MenuItem>
                ))}

                {nextQuestions.length > 0 && <Divider />}
                {nextQuestions.map((q) => (
                    <MenuItem key={`skip-${q.temp_id}`} value={`skip_question-${q.temp_id}`}>
                        ข้ามไปยังคำถามที่ {q.question_no}
                    </MenuItem>
                ))}

                {nextSections.length > 0 && <Divider />}
                {nextSections.map((s) => (
                    <MenuItem key={`sec-${s.temp_id}`} value={`skip_section-${s.temp_id}`}>
                        ข้ามไปยังส่วนที่ {s.section_no}
                    </MenuItem>
                ))}
            </Select>
        </Box>
    );
};

export default SelectCondition;


