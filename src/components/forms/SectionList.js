"use client";
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Add, Close, DragHandle, ExpandLess, ExpandMore } from "@mui/icons-material";
import { Box, Button, Chip, Divider, IconButton, TextField, Tooltip } from "@mui/material";
import { CSS } from "@dnd-kit/utilities";
import { arrayMove } from "@dnd-kit/sortable";
import React from "react";
import QuestionDragAndDrop from "./Question";
import { getRandomId } from "../../helpers/random";

function SortableItem({ section, setSections, onAdd, sections }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: section.id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        marginBottom: 4,
        p: 2,
        borderRadius: 8,
        backgroundColor: "white",
    };

    const handleMoveSectionUp = () => {
        setSections((prev) => {
            const index = prev.findIndex((s) => s.temp_id === section.temp_id);
            if (index > 0) {
                const newSections = arrayMove(prev, index, index - 1);
                // ปรับ section_no ใหม่ทั้งหมดให้เรียงต่อกัน
                return newSections.map((s, i) => ({ ...s, section_no: i + 1 }));
            }
            return prev;
        });
    };
    const handleMoveSectionDown = () => {
        setSections((prev) => {
            const index = prev.findIndex((s) => s.temp_id === section.temp_id);
            if (index < prev.length - 1) {
                const newSections = arrayMove(prev, index, index + 1);
                // ปรับ section_no ใหม่ทั้งหมดให้เรียงต่อกัน
                return newSections.map((s, i) => ({ ...s, section_no: i + 1 }));
            }
            return prev;
        });
    }

    const handleAddQuestion = () => {
        const newQuestion = {
            temp_id: `question-${getRandomId()}`,
            question_no: section.questions.length + 1,
            question: '',
            question_type_id: 1,
            options: [],
        };
        setSections((prev) => prev.map((s) => (s.temp_id === section.temp_id ? { ...s, questions: [...s.questions, newQuestion] } : s)));
    };
    const handleDeleteSection = () => {
        setSections((prev) => prev.filter((s) => s.temp_id !== section.temp_id));
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
                        <Chip label={`ส่วนที่ ${section.section_no}`} size="small" color="default"
                            sx={{ width: 'fit-content' }}
                        />
                    </Box>
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Tooltip title="ลากเพื่อเปลี่ยนลำดับ">
                            <IconButton
                                {...listeners}
                                {...attributes}
                                aria-describedby="drag-handle-section"
                                sx={{ p: 0 }}>
                                <DragHandle />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
                        <Tooltip title="เลื่อนขึ้น">
                            <IconButton
                                disabled={section.section_no === 1}
                                sx={{ p: 0 }}
                                onClick={handleMoveSectionUp}>
                                <ExpandLess />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="เลื่อนลง">
                            <IconButton
                                sx={{ p: 0 }}
                                onClick={handleMoveSectionDown}>
                                <ExpandMore />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>
                <TextField
                    fullWidth
                    label="ชื่อส่วน"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    placeholder="ตัวอย่าง: ข้อมูลทั่วไป"
                    value={section.section_title || ""}
                    onChange={(e) => {
                        const newTitle = e.target.value;
                        setSections((prev) =>
                            prev.map((s) =>
                                s.temp_id === section.temp_id ? { ...s, section_title: newTitle } : s
                            )
                        );
                    }}
                />
                <TextField
                    fullWidth
                    label="คำอธิบายส่วน"
                    variant="outlined"
                    multiline
                    InputLabelProps={{ shrink: true }}
                    placeholder="ตัวอย่าง: ส่วนนี้เป็นข้อมูลทั่วไปเกี่ยวกับผู้ตอบแบบสอบถาม"
                    value={section.section_note || ""}
                    onChange={(e) => {
                        const newDescription = e.target.value;
                        setSections((prev) =>
                            prev.map((s) =>
                                s.temp_id === section.temp_id ? { ...s, section_note: newDescription } : s
                            )
                        );
                    }}
                />
                <QuestionDragAndDrop questions={section.questions} onChange={(newQuestions) => {
                    setSections((prev) =>
                        prev.map((s) =>
                            s.temp_id === section.temp_id ? { ...s, questions: newQuestions } : s
                        )
                    );
                }}
                    sections={sections}
                />
                <Divider />
                <Box sx={{ display: "flex", flexDirection: "row", gap: 1, justifyContent: "flex-end", alignItems: "center", p: 1 }}>
                    <Button variant="outlined" color="primary" startIcon={<Add />} onClick={handleAddQuestion}>เพิ่มคำถาม</Button>
                    <Button variant="outlined" color="success" startIcon={<Add />} onClick={() =>
                        onAdd(section.temp_id)
                    }>เพิ่มส่วนใหม่</Button>
                    <Button variant="outlined" color="error" startIcon={<Close />} onClick={handleDeleteSection}>ลบส่วนนี้</Button>
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
            const oldIndex = sections.findIndex((s) => s.temp_id === active.id);
            const newIndex = sections.findIndex((s) => s.temp_id === over.id);
            setSections((items) => arrayMove(items, oldIndex, newIndex));
        }
    };

    const handleAddSection = (section_id) => {
        const index = sections.findIndex((s) => s.temp_id === section_id);

        const newSection = {
            temp_id: `section-${getRandomId()}`,
            section_no: index + 2,
            section_title: '',
            section_note: '',
            questions: [
                {
                    temp_id: `question-${getRandomId()}`,
                    question_no: 1,
                    question: '',
                    question_type_id: 1,
                    options: [],
                },
            ],
        };

        const newSections = [...sections];

        // แทรก section ใหม่หลัง index ที่เลือก
        newSections.splice(index + 1, 0, newSection);

        // ปรับ section_no ใหม่ทั้งหมดให้เรียงต่อกัน
        const updatedSections = newSections.map((s, i) => ({
            ...s,
            section_no: i + 1,
        }));

        setSections(updatedSections);
    };

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={sections} strategy={verticalListSortingStrategy}>
                {sections.map((section) => (
                    <SortableItem key={section.temp_id} section={section} sections={sections} setSections={setSections} onAdd={handleAddSection} />
                ))}
            </SortableContext>
        </DndContext>
    );
}

export default SectionList;

