"use client";
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { Box, Checkbox, FormControlLabel, IconButton, Radio, Select, TextField } from "@mui/material";
import { CSS } from "@dnd-kit/utilities";
import { Add, CheckBox, Circle, CircleOutlined, Close, DragHandle, DragIndicator } from "@mui/icons-material";
import { getRandomId } from "../../helpers/random";
import Actions from "../Actions";
import SelectCondition from "./SelectCondition";

function SortableItem({ option, question, questions, onChange, onDelete, onAdd, sections }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: option.temp_id });

    return (
        <Box
            ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
                padding: 2,
                backgroundColor: "white",
            }}
            sx={{ display: "flex", alignItems: "center", gap: 1, width: '100%' }}
        >
            <IconButton
                {...listeners}
                {...attributes}
                aria-describedby="drag-handle-option"
                sx={{
                    cursor: "grab",
                    '&:hover': { backgroundColor: 'primary.main', color: 'white' }
                }}>
                <DragIndicator fontSize="small" />
            </IconButton>

            {/* ไอคอน checkbox หรือ radio */}
            {question.question_type_id === 3 ? (
                <Box sx={{ color: "action.active" }}><CircleOutlined fontSize="small" /></Box>
            ) : question.question_type_id === 4 ? (
                <Box sx={{ color: "action.active" }}><CheckBox fontSize="small" /></Box>
            ) : null}

            {/* input ของ option */}
            <TextField
                value={option.option || ""}
                variant="standard"
                size="small"
                fullWidth
                sx={{
                    flex: 1,
                    "& .MuiInputBase-root": { height: "40px" },
                }}
                onChange={(e) => onChange({ ...option, option: e.target.value })}
            />

            {/*input description option*/}
            <TextField
                value={option?.description || ""}
                variant="standard"
                size="small"
                placeholder="หมายเหตุ: "
                sx={{
                    flex: 0.5,
                    "& .MuiInputBase-root": { height: "40px" },
                }}
                onChange={(e) => onChange({ ...option, description: e.target.value })}
            />
            <IconButton aria-label="add-option" onClick={() => onAdd(option.temp_id)}>
                <Add fontSize="small" />
            </IconButton>
            {/* ปุ่มลบ */}
            <IconButton aria-label="delete-option" onClick={() => onDelete(option.temp_id)}>
                <Close fontSize="small" />
            </IconButton>

            {/* เงื่อนไข เช่น ข้ามคำถามข้อที่ ... หรือต้องตอบคำถามข้อที่ ... ด้วย */}
            <SelectCondition option={option} questions={questions} onChange={onChange} question={question} sections={sections} />

            {/* ถ้าเป็น checkbox ให้มีตัวเลือก exclusive ด้วย */}
            {question.question_type_id === 4 && (
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={option.is_exclusive || false}
                            onChange={(e) => onChange({ ...option, is_exclusive: e.target.checked })}
                        />
                    }
                    label="เลือกคำตอบอื่นไม่ได้อีก"
                />
            )}

        </Box>
    );
}

const OptionsList = ({ options, setOptions, question, questions, sections }) => {
    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over) return;
        if (active.id !== over.id) {
            const oldIndex = options.findIndex((o) => o.temp_id === active.id);
            const newIndex = options.findIndex((o) => o.temp_id === over.id);
            // option_no ต้องเรียงใหม่ด้วย
            const updatedOptions = arrayMove(options, oldIndex, newIndex).map((o, i) => ({ ...o, option_no: i + 1 }));
            setOptions(updatedOptions);
        }
    };

    const handleOptionChange = (updatedOption) => {
        setOptions(options.map((o) => (o.temp_id === updatedOption.temp_id ? updatedOption : o)));
    };

    const handleOptionDelete = (option_id) => {
        const newOptions = options.filter((o) => o.temp_id !== option_id);
        // ปรับ option_no ใหม่ทั้งหมดให้เรียงต่อกัน
        const formatedOptions = newOptions.map((o, i) => ({ ...o, option_no: i + 1 }));
        setOptions(formatedOptions);
    };

    const handleAddOption = (option_id) => {
        const index = options.findIndex((o) => o.temp_id === option_id);
        const newOption = { temp_id: `option-${getRandomId()}`, option: '', option_no: index + 2 };
        const newOptions = [...options];
        newOptions.splice(index + 1, 0, newOption);
        // ปรับ option_no ใหม่ทั้งหมดให้เรียงต่อกัน
        const formatedOptions = newOptions.map((o, i) => ({ ...o, option_no: i + 1 }));
        setOptions(formatedOptions);
    };

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={options.map((o) => o.temp_id)} strategy={verticalListSortingStrategy}>
                {options.map((option) => (
                    <SortableItem
                        key={option.temp_id}
                        option={option}
                        question={question}
                        questions={questions}
                        sections={sections}
                        onChange={handleOptionChange}
                        onDelete={handleOptionDelete}
                        onAdd={handleAddOption}
                    />
                ))}
            </SortableContext>
        </DndContext>
    );
};

export default OptionsList;
