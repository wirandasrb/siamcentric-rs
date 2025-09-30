"use client";
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { DragHandle } from "@mui/icons-material";
import { Box, IconButton, TextField } from "@mui/material";
import { CSS } from "@dnd-kit/utilities";
import { arrayMove } from "@dnd-kit/sortable";
import React from "react";

function SortableItem({ section }) {
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
                    <IconButton {...listeners} {...attributes} sx={{ p: 0 }}>
                        <DragHandle />
                    </IconButton>
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
                    <SortableItem key={section.id} section={section} />
                ))}
            </SortableContext>
        </DndContext>
    );
}

export default SectionList;

