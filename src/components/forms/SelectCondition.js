
// import { Box, Divider, MenuItem, Select } from "@mui/material";

// const SelectCondition = ({ questions, option, onChange, question, sections }) => {
//     const currentCondition = option.conditions?.[0] ?? null;

//     // คำถามถัดไปทั้งหมด
//     const nextQuestions = questions.filter(q => q.question_no > question.question_no);

//     // ส่วนถัดไปทั้งหมด
//     const currentSection = sections.find(s => s.questions.some(q => q.temp_id === question.temp_id));
//     const nextSections = currentSection
//         ? sections.filter(s => s.section_no > currentSection.section_no)
//         : [];

//     // หา value ที่ Select จะใช้
//     const selectValue = (() => {
//         if (!currentCondition) return "";
//         if (currentCondition.condition_type === "require_question") return `require_question-${currentCondition.target_question_temp_id || currentCondition.target_question_id}`;
//         if (currentCondition.condition_type === "skip_question") return `skip_question-${currentCondition.target_question_temp_id || currentCondition.target_question_id}`;
//         if (currentCondition.condition_type === "skip_section") return `skip_section-${currentCondition.target_section_temp_id || currentCondition.target_section_id}`;
//         return "";
//     })();

//     const handleChange = (e) => {
//         const value = e.target.value;
//         if (!value) {
//             onChange({ ...option, is_have_condition: false, conditions: [] });
//             return;
//         }

//         const [condition_type, targetId] = value.split("-");
//         const newCondition = {
//             option_id: option.temp_id,
//             condition_type,
//             target_question_id: condition_type !== "skip_section" ? targetId : null,
//             target_section_id: condition_type === "skip_section" ? targetId : null,
//             required_option_id: null,
//         };

//         onChange({ ...option, is_have_condition: true, conditions: [newCondition] });
//     };

//     return (
//         <Box sx={{ width: 250 }}>
//             <Select
//                 sx={{ height: 40, width: "100%" }}
//                 value={selectValue}
//                 displayEmpty
//                 onChange={(e) => {
//                     const value = e.target.value;
//                     if (!value) {
//                         onChange({ ...option, is_have_condition: false, conditions: [] });
//                         return;
//                     }

//                     const [condition_type, targetId] = (value + "").split("-");
//                     const newCondition = {
//                         option_id: option.temp_id,
//                         condition_type,
//                         target_question_id: condition_type !== "skip_section" ? targetId : null,
//                         target_section_id: condition_type === "skip_section" ? targetId : null,
//                         required_option_id: null,
//                     };

//                     onChange({ ...option, is_have_condition: true, conditions: [newCondition] });
//                 }}
//             >
//                 <MenuItem value="">ไม่มีเงื่อนไข</MenuItem>
//                 {nextQuestions.map((q) => (
//                     <MenuItem key={`req-${q.temp_id}`} value={`require_question-${q.temp_id}`}>
//                         ต้องตอบคำถามที่ {q.question_no}
//                     </MenuItem>
//                 ))}

//                 {nextQuestions.length > 0 && <Divider />}
//                 {nextQuestions.map((q) => (
//                     <MenuItem key={`skip-${q.temp_id}`} value={`skip_question-${q.temp_id}`}>
//                         ข้ามไปยังคำถามที่ {q.question_no}
//                     </MenuItem>
//                 ))}

//                 {nextSections.length > 0 && <Divider />}
//                 {nextSections.map((s) => (
//                     <MenuItem key={`sec-${s.temp_id}`} value={`skip_section-${s.temp_id}`}>
//                         ข้ามไปยังส่วนที่ {s.section_no}
//                     </MenuItem>
//                 ))}
//             </Select>
//         </Box>
//     );
// };

// export default SelectCondition;

import { Box, Divider, MenuItem, Select } from "@mui/material";

const SelectCondition = ({ questions, option, onChange, question, sections }) => {
    const currentCondition = option.conditions?.[0] ?? null;

    // หาว่า question นี้อยู่ใน section ไหน
    const currentSection = sections.find(s => s.questions.some(q => q.temp_id === question.temp_id));

    // คำถามถัดไปทั้งหมด (ภายใน form)
    const nextQuestions = questions.filter(q => q.question_no > question.question_no);

    // ส่วนถัดไปทั้งหมด
    const nextSections = currentSection
        ? sections.filter(s => s.section_no > currentSection.section_no)
        : [];

    // ✅ helper ดึง id ให้ใช้ temp_id ก่อน ถ้าไม่มีค่อยใช้ id จริง
    const getId = (item) => item?.temp_id || item?.id;

    // ✅ หาค่า value ของ Select ให้ match กับ MenuItem
    const selectValue = (() => {
        if (!currentCondition) return "";

        const { condition_type } = currentCondition;
        const targetId =
            currentCondition.target_question_temp_id ||
            currentCondition.target_question_id ||
            currentCondition.target_section_temp_id ||
            currentCondition.target_section_id;

        if (!targetId) return "";

        return `${condition_type}-${targetId}`;
    })();

    // ✅ เวลาผู้ใช้เปลี่ยนค่าใน Select
    const handleChange = (e) => {
        const value = e.target.value;
        if (!value) {
            onChange({ ...option, is_have_condition: false, conditions: [] });
            return;
        }

        // ใช้ indexOf() เพื่อแยกเฉพาะส่วนแรกกับส่วนที่เหลือ ป้องกัน split ผิด
        const dashIndex = value.indexOf("-");
        const condition_type = value.substring(0, dashIndex);
        const targetId = value.substring(dashIndex + 1);

        const newCondition = {
            option_id: option.temp_id || option.id,
            condition_type,
            required_option_id: null,
            // เก็บ temp_id เป็นหลัก (ยังไม่มี id จริง)
            target_question_temp_id: condition_type !== "skip_section" ? targetId : null,
            target_section_temp_id: condition_type === "skip_section" ? targetId : null,
            // สำหรับตอนบันทึก DB
            target_question_id: null,
            target_section_id: null,
        };

        onChange({
            ...option,
            is_have_condition: true,
            conditions: [newCondition],
        });
    };

    return (
        <Box sx={{ width: 250 }}>
            <Select
                sx={{ height: 40, width: "100%" }}
                value={selectValue}
                displayEmpty
                onChange={handleChange}
            >
                <MenuItem value="">ไม่มีเงื่อนไข</MenuItem>

                {/* require question */}
                {nextQuestions.map((q) => (
                    <MenuItem
                        key={`req-${getId(q)}`}
                        value={`require_question-${getId(q)}`}
                    >
                        ต้องตอบคำถามที่ {q.question_no}
                    </MenuItem>
                ))}

                {nextQuestions.length > 0 && <Divider />}

                {/* skip question */}
                {nextQuestions.map((q) => (
                    <MenuItem
                        key={`skip-${getId(q)}`}
                        value={`skip_question-${getId(q)}`}
                    >
                        ข้ามไปยังคำถามที่ {q.question_no}
                    </MenuItem>
                ))}

                {nextSections.length > 0 && <Divider />}

                {/* skip section */}
                {nextSections.map((s) => (
                    <MenuItem
                        key={`sec-${getId(s)}`}
                        value={`skip_section-${getId(s)}`}
                    >
                        ข้ามไปยังส่วนที่ {s.section_no}
                    </MenuItem>
                ))}
            </Select>
        </Box>
    );
};

export default SelectCondition;
