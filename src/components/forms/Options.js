"use client";
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { Box, IconButton, Radio, TextField } from "@mui/material";
import { CSS } from "@dnd-kit/utilities";
import { Add, CheckBox, Circle, CircleOutlined, Close, DragHandle, DragIndicator } from "@mui/icons-material";

function SortableItem({ option, question, onChange, onDelete, onAdd }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: option.id });

    return (
        <Box
            ref={setNodeRef}
            aria-describedby="drag-handle-option"
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
                padding: 2,
                backgroundColor: "white",
            }}
            sx={{ display: "flex", alignItems: "center", gap: 1, width: '70%' }}
        >
            <IconButton
                aria-describedby="drag-handle-option"
                sx={{ cursor: "grab", '&:hover': { backgroundColor: 'primary.main', color: 'white' } }} {...listeners} {...attributes}>
                <DragIndicator fontSize="small" />
            </IconButton>

            {/* ไอคอน checkbox หรือ radio */}
            {question.type_id === 3 ? (
                <Box sx={{ color: "action.active" }}><CircleOutlined fontSize="small" /></Box>
            ) : question.type_id === 4 ? (
                <Box sx={{ color: "action.active" }}><CheckBox fontSize="small" /></Box>
            ) : null}

            {/* input ของ option */}
            <TextField
                value={option.label}
                variant="standard"
                size="small"
                sx={{
                    flex: 1,
                    "& .MuiInputBase-root": { height: "40px" },
                }}
                onChange={(e) => onChange({ ...option, label: e.target.value })}
            />
            <IconButton aria-label="add-option" onClick={() => onAdd(option.id)}>
                <Add fontSize="small" />
            </IconButton>
            {/* ปุ่มลบ */}
            <IconButton aria-label="delete-option" onClick={() => onDelete(option.id)}>
                <Close fontSize="small" />
            </IconButton>
        </Box>
    );
}

const OptionsList = ({ options, setOptions, question }) => {
    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over) return;
        if (active.id !== over.id) {
            const oldIndex = options.findIndex((o) => o.id === active.id);
            const newIndex = options.findIndex((o) => o.id === over.id);
            setOptions(arrayMove(options, oldIndex, newIndex));
        }
    };

    const handleOptionChange = (updatedOption) => {
        setOptions(options.map((o) => (o.id === updatedOption.id ? updatedOption : o)));
    };

    const handleOptionDelete = (id) => {
        setOptions(options.filter((o) => o.id !== id));
    };

    const handleAddOption = (option_id) => {
        const newOption = { id: `option-${Date.now()}`, label: '' };
        const index = options.findIndex((o) => o.id === option_id);
        const newOptions = [...options];
        newOptions.splice(index + 1, 0, newOption);
        setOptions(newOptions);
    };

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={options.map((o) => o.id)} strategy={verticalListSortingStrategy}>
                {options.map((option) => (
                    <SortableItem
                        key={option.id}
                        option={option}
                        question={question}
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
