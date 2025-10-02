"use client";
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Add, Close, DragHandle, ExpandLess, ExpandMore } from "@mui/icons-material";
import { Box, Button, Chip, Divider, IconButton, TextField, Tooltip } from "@mui/material";
import { CSS } from "@dnd-kit/utilities";
import { arrayMove } from "@dnd-kit/sortable";
import React from "react";
import QuestionDragAndDrop from "./Question";

function SortableItem({ section, setSections }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: section.id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        marginBottom: 4,
        p: 2,
        borderRadius: 8,
        backgroundColor: "white",
    };

    return (
        <Box ref={setNodeRef} style={style} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{
                flexGrow: 1,            // ขยายเต็ม
                display: "flex",
                flexDirection: "column",
                p: 2,
                gap: 2,
                backgroundColor: "white",
                borderRadius: 2,
                boxShadow: 3,
            }}>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Box sx={{ display: "flex", flexGrow: 1 }} >
                        <Chip label={`ส่วนที่ ${section.id}`} size="small" color="default"
                            sx={{ width: 'fit-content' }}
                        />
                    </Box>
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Tooltip title="ลากเพื่อเปลี่ยนลำดับ">
                            <IconButton {...listeners} {...attributes} sx={{ p: 0 }}>
                                <DragHandle />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
                        <IconButton sx={{ p: 0 }}>
                            <ExpandLess />
                        </IconButton>
                        <IconButton sx={{ p: 0 }}><ExpandMore /></IconButton>
                    </Box>
                </Box>
                <TextField
                    fullWidth
                    label="ชื่อส่วน"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    placeholder="ตัวอย่าง: ข้อมูลทั่วไป"
                />
                <TextField
                    fullWidth
                    label="คำอธิบายส่วน"
                    variant="outlined"
                    multiline
                    InputLabelProps={{ shrink: true }}
                    placeholder="ตัวอย่าง: ส่วนนี้เป็นข้อมูลทั่วไปเกี่ยวกับผู้ตอบแบบสอบถาม"
                />
                <QuestionDragAndDrop questions={section.questions} onChange={(newQuestions) => {
                    setSections((prev) =>
                        prev.map((s) =>
                            s.id === section.id ? { ...s, questions: newQuestions } : s
                        )
                    );
                }} />
                <Divider />
                <Box sx={{ display: "flex", flexDirection: "row", gap: 1, justifyContent: "flex-end", alignItems: "center", p: 1 }}>
                    <Button variant="outlined" color="error" startIcon={<Close />}>ลบส่วนนี้</Button>
                    <Button variant="outlined" color="primary" startIcon={<Add />}>เพิ่มคำถาม</Button>
                </Box>
            </Box>
        </Box>
    );
}


const SectionList = ({ sections, setSections }) => {
    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = sections.findIndex((s) => s.id === active.id);
            const newIndex = sections.findIndex((s) => s.id === over.id);
            setSections((items) => arrayMove(items, oldIndex, newIndex));
        }
    };
    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={sections} strategy={verticalListSortingStrategy}>
                {sections.map((section) => (
                    <SortableItem key={section.id} section={section} setSections={setSections} />
                ))}
            </SortableContext>
        </DndContext>
    );
}

export default SectionList;

