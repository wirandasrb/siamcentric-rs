"use client";
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { Add, AddCircle, Apps, CheckBox, Circle, Close, ColorLens, ContentCopy, Delete, DragHandle, DragIndicator, Event, ExpandCircleDown, ExpandLess, ExpandMore, FileUpload, LinearScale, Notes, Schedule, ShortText, StarHalf } from "@mui/icons-material";
import { Autocomplete, Box, Button, Checkbox, Chip, Divider, IconButton, TextField, Tooltip, Typography } from "@mui/material";
import { CSS } from "@dnd-kit/utilities";
import OptionsList from "./Options";

const questionTypes = [
    { id: 1, label: "ข้อความสั้น", icon: <ShortText /> },
    { id: 2, label: "ข้อความยาว", icon: <Notes /> },
    { id: 3, label: "ตัวเลือกเดียว", icon: <Circle /> },
    { id: 4, label: "หลายตัวเลือก", icon: <CheckBox /> },
    { id: 5, label: "เลื่อนลง", icon: <ExpandCircleDown /> },
    { id: 6, label: "คะแนน", icon: <StarHalf /> },
    { id: 7, label: "สเกลเชิงเส้น", icon: <LinearScale /> },
    { id: 8, label: "เมทริกซ์", icon: <Apps /> },
    { id: 9, label: "อัปโหลดไฟล์", icon: <FileUpload /> },
    { id: 10, label: "วันที่", icon: <Event /> },
    { id: 11, label: "เวลา", icon: <Schedule /> },
];

function QuestionItem({ question, onChange, onDelete, onAdd }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: question.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleAddOption = () => {
        const newOption = { id: `option-${Date.now()}`, label: '' };
        const newOptions = question.options ? [...question.options, newOption] : [newOption];
        onChange({ ...question, options: newOptions });
    }

    const handleOptionOther = () => {
        const newOption = { id: `option-${Date.now()}`, label: 'อื่นๆ (โปรดระบุ)' };
        const newOptions = question.options ? [...question.options, newOption] : [newOption];
        onChange({ ...question, options: newOptions });
    }

    return (
        <Box
            ref={setNodeRef}
            style={style}
            sx={{ display: "flex", flexDirection: "row", gap: 1 }}
        >
            <Box sx={{ display: "flex", alignItems: "center", p: 1 }}>
                <IconButton
                    {...listeners}
                    {...attributes}
                    aria-describedby="drag-handle-question"
                    sx={{
                        p: 0,
                        display: "flex",
                        alignItems: "center",
                        '&:hover': { color: 'primary.main', backgroundColor: 'white' },
                        cursor: "grab"
                    }}>
                    <DragIndicator />
                </IconButton>
            </Box>

            <Box
                sx={{
                    flex: 1,
                    p: 2,
                    border: "1px solid #e0e0e0",
                    borderRadius: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
            >
                <Chip label={`คำถามที่ ${question.id}`} size="small" color="primary"
                    sx={{ width: 'fit-content' }}
                />
                <TextField
                    fullWidth
                    label={`คำถาม`}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    placeholder="พิมพ์คำถามที่นี่"
                    value={question.text || ""}
                    sx={{
                        '& .MuiInputBase-root': { height: '40px' },
                    }}
                />
                <Autocomplete
                    options={questionTypes}
                    getOptionLabel={(option) => option.label}
                    value={questionTypes.find((type) => type.id === question.type_id) || null}
                    onChange={(e, newValue) => {
                        if (!newValue) return;
                        // ถ้าเปลี่ยนจากประเภทตัวเลือก ให้ลบ options ทิ้ง
                        if (question.type_id === 3 || question.type_id === 4 || question.type_id === 5) {
                            if (!(newValue.id === 3 || newValue.id === 4 || newValue.id === 5)) {
                                onChange({ ...question, type: newValue.label, type_id: newValue.id, options: [] });
                            } else {
                                onChange({ ...question, type: newValue.label, type_id: newValue.id });
                            }
                        } else {
                            if (newValue.id === 3 || newValue.id === 4 || newValue.id === 5) {
                                onChange({ ...question, type: newValue.label, type_id: newValue.id, options: [{ id: `option-${Date.now()}`, label: '' }] });
                            } else {
                                onChange({ ...question, type: newValue.label, type_id: newValue.id });
                            }
                        }
                    }}
                    renderInput={(params) => <TextField {...params} label="ประเภทคำถาม" />}
                    renderOption={(props, option) => (
                        <Box component="li" {...props} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            {option.icon} {option.label}
                        </Box>
                    )}
                />
                {(question.type_id === 3 || question.type_id === 4 || question.type_id === 5) && (<>
                    <OptionsList
                        options={question.options || []}
                        setOptions={(newOptions) => onChange({ ...question, options: newOptions })}
                        question={question}
                    />
                    <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", ml: 4 }}>
                        <Button
                            sx={{
                                textTransform: 'none',
                                fontWeight: 'normal',
                                color: 'primary.main',
                                border: 'none',

                                '&:hover': {
                                    border: 'none',
                                    color: 'primary.dark',
                                },
                            }}
                            variant="outlined"
                            startIcon={<Add />}
                            onClick={handleAddOption}>
                            เพิ่มตัวเลือก
                        </Button>
                        <Typography variant="caption" color="textSecondary" sx={{ ml: 2 }}>
                            หรือ
                        </Typography>
                        <Button
                            sx={{
                                textTransform: 'none',
                                fontWeight: 'normal',
                                color: 'primary.main',
                                border: 'none',
                                '&:hover': {
                                    border: 'none',
                                    color: 'primary.dark',
                                },
                            }}
                            variant="outlined"
                            onClick={
                                handleOptionOther
                            }
                        >
                            เพิ่มตัวเลือกอื่นๆ
                        </Button>
                    </Box>
                </>
                )}

                <Divider />
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Checkbox />
                        <Typography variant="caption" color="textSecondary">บังคับตอบคำถาม</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 1 }}>
                        <Tooltip title="เพิ่มคำถามถัดไป">
                            <IconButton aria-label="add-question-back" color="primary" sx={{ p: 0 }} onClick={() => onAdd(question.id)}>
                                <AddCircle />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="คัดลอกคำถาม">
                            <IconButton aria-label="duplicate-question" color="default" sx={{ p: 0 }}>
                                <ContentCopy />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="ลบคำถามนี้">
                            <IconButton aria-label="delete-question" color="error" sx={{ p: 0 }} onClick={() => onDelete(question.id)}>
                                <Delete />
                            </IconButton>
                        </Tooltip>
                        <Box sx={{
                            borderLeft: 1, borderColor: 'divider', height: 24, ml: 2
                        }} />
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <IconButton aria-label="collapse-question" sx={{ p: 0 }}>
                                <ExpandLess />
                            </IconButton>
                        </Box>
                    </Box>

                </Box>
            </Box>
        </Box>
    );
}

const QuestionDragAndDrop = ({ questions, onChange }) => {
    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over) return;
        if (active.id !== over.id) {
            const oldIndex = questions.findIndex((q) => q.id === active.id);
            const newIndex = questions.findIndex((q) => q.id === over.id);
            onChange(arrayMove(questions, oldIndex, newIndex));
        }
    };

    const handleQuestionChange = (updatedQuestion) => {
        onChange(questions.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q)));
    };

    const handleQuestionDelete = (id) => {
        onChange(questions.filter((q) => q.id !== id));
    };

    const handleAddQuestion = (question_id) => {
        const newQuestion = { id: `question-${Date.now()}`, text: '', type: 'short_text', type_id: 1 };
        const index = questions.findIndex((q) => q.id === question_id);
        const newQuestions = [...questions];
        newQuestions.splice(index + 1, 0, newQuestion);
        onChange(newQuestions);
    };

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={questions.map((q) => q.id)} strategy={verticalListSortingStrategy}>
                {questions.map((question) => (
                    <QuestionItem key={question.id} question={question} onChange={handleQuestionChange} onDelete={handleQuestionDelete} onAdd={handleAddQuestion} />
                ))}
            </SortableContext>
        </DndContext>
    );
};

export default QuestionDragAndDrop;
