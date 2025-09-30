"use client";

import { Add, Apps, CheckBox, Circle, Close, ColorLens, DragHandle, DragIndicator, Event, ExpandCircleDown, FileUpload, LinearScale, Notes, Schedule, ShortText, StarHalf } from "@mui/icons-material";
import { Autocomplete, Box, Button, Divider, IconButton, TextField, Typography, Popover, Grid } from "@mui/material";
import { useParams } from "next/navigation";
import { useState } from "react";
import { SketchPicker } from "react-color";
import SectionList from "../../../../components/forms/SectionList";

const colorPaletteDefault = ["#1976d2", "#43a047", "#e53935", "#f57c00", "#8e24aa", "#fbc02d"];
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
const FormCreatePage = () => {
    const { id } = useParams();
    const [openThemeMenu, setOpenThemeMenu] = useState(false);

    const [primaryColor, setPrimaryColor] = useState("#1976d2");
    const [secondColor, setSecondColor] = useState("#f5f5f5");
    const [fontFamily, setFontFamily] = useState("Sarabun");
    const [logo, setLogo] = useState(null);

    const [colorAnchorEl, setColorAnchorEl] = useState(null);
    const [colorPickerTarget, setColorPickerTarget] = useState("primary");

    const [sections, setSections] = useState([
        { id: 'section-1', title: '', description: '' },
        { id: 'section-2', title: '', description: '' },
    ]);

    const handleLogoChange = (event) => {
        if (event.target.files?.[0]) setLogo(event.target.files[0]);
    };

    const handleOpenColorPicker = (event, target) => {
        setColorAnchorEl(event.currentTarget);
        setColorPickerTarget(target);
    };

    const handleCloseColorPicker = () => {
        setColorAnchorEl(null);
    };

    const handleChangeColor = (color) => {
        if (colorPickerTarget === "primary") setPrimaryColor(color.hex);
        else setSecondColor(color.hex);
    };

    const colorPickerOpen = Boolean(colorAnchorEl);

    return (
        <Box sx={{ display: "flex", gap: 2, backgroundColor: secondColor }}>
            {/* ฟอร์มหลัก */}
            <Box
                sx={{
                    flex: 1, // ฟอร์มกินพื้นที่ที่เหลือ
                    display: "flex",
                    flexDirection: "column",
                    p: 2,
                    gap: 2,
                    transition: "margin-right 0.3s",
                    // marginRight: openThemeMenu ? "300px" : 0, // เวลามี panel เบียดออกไป
                }}
            >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h5">
                        {id === "create" ? "สร้างแบบสอบถาม" : "แก้ไขแบบสอบถาม"}
                    </Typography>
                    <IconButton onClick={() => setOpenThemeMenu(!openThemeMenu)} sx={{ p: 0 }}>
                        <ColorLens color={openThemeMenu ? "primary" : "action"} />
                    </IconButton>
                </Box>

                <Box
                    sx={{
                        backgroundColor: "white",
                        borderRadius: 2,
                        boxShadow: 3,
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                    }}
                >
                    <TextField
                        fullWidth
                        label="ชื่อแบบสอบถาม"
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        placeholder="ตัวอย่าง: แบบสอบถามความพึงพอใจ"
                    />
                    <TextField
                        fullWidth
                        label="คำอธิบายแบบสอบถาม"
                        variant="outlined"
                        multiline
                        rows={4}
                        InputLabelProps={{ shrink: true }}
                        placeholder="ตัวอย่าง: แบบสอบถามนี้จัดทำขึ้นเพื่อสำรวจความพึงพอใจของลูกค้าเกี่ยวกับบริการของเรา"
                    />
                    <TextField
                        fullWidth
                        label="หมายเหตุ"
                        variant="outlined"
                        multiline
                        InputLabelProps={{ shrink: true }}
                        placeholder="ตัวอย่าง: กรุณาตอบคำถามทุกข้ออย่างตรงไปตรงมา ข้อมูลของคุณจะถูกเก็บเป็นความลับ"
                    />
                    {/* Form goes here */}
                </Box>

                {/* create section and question here */}

                <SectionList sections={sections} setSections={setSections} />

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
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <IconButton
                            onClick={() => { }}
                        >
                            <DragHandle />
                        </IconButton>
                    </Box>
                    <TextField
                        fullWidth
                        label="ชื่อส่วน"
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        placeholder="ตัวอย่าง: ส่วนที่ 1 ข้อมูลทั่วไป"
                    />
                    <TextField
                        fullWidth
                        label="คำอธิบายส่วน"
                        variant="outlined"
                        multiline
                        InputLabelProps={{ shrink: true }}
                        placeholder="ตัวอย่าง: ส่วนนี้เป็นการรวบรวมข้อมูลทั่วไปของผู้ตอบแบบสอบถาม เช่น เพศ อายุ การศึกษา เป็นต้น"
                    />

                    {/* Question example */}
                    <Box sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 2

                    }}>
                        <IconButton sx={{
                            p: 0, mb: 1,
                            display: "flex",
                            alignItems: "center",
                            color: "action.active",
                        }}>
                            <DragIndicator />
                        </IconButton>
                        <Box sx={{
                            p: 2,
                            border: "1px solid #e0e0e0",
                            borderRadius: 2,
                            gap: 2,
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                        }}>
                            <Box sx={{
                                display: "flex",
                                flexDirection: "row",
                                gap: 1,
                            }}
                            >
                                <TextField
                                    fullWidth
                                    label="คำถาม"
                                    variant="outlined"
                                    InputLabelProps={{ shrink: true }}
                                    placeholder="ตัวอย่าง: กรุณาระบุเพศของคุณ"
                                />
                                <Autocomplete

                                    options={questionTypes}
                                    getOptionLabel={(option) => option.label}
                                    value={questionTypes[0]}
                                    renderInput={(params) => (
                                        <TextField {...params} label="ประเภทคำถาม"
                                        />
                                    )}
                                    renderOption={(props, option) => (
                                        <Box component="li" {...props} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <span>{option.icon}</span>
                                            <span>{option.label}</span>
                                        </Box>
                                    )}
                                    fullWidth
                                />
                            </Box>
                        </Box>
                    </Box>


                </Box>

            </Box>

            {/* Theme Panel */}
            {
                openThemeMenu && (
                    <Box
                        sx={{
                            width: 300,
                            flexShrink: 0, // กันไม่ให้บีบ panel
                            display: "flex",
                            flexDirection: "column",
                            bgcolor: "#fff",
                            borderLeft: "1px solid #e0e0e0",
                            height: "calc(100vh - 64px)",
                            top: "64px",
                            right: 0,
                            overflowY: "auto",
                        }}
                    >
                        <Box sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="h6">ธีม</Typography>
                            <IconButton onClick={() => setOpenThemeMenu(false)} sx={{ p: 0 }}>
                                <Close />
                            </IconButton>
                        </Box>
                        <Divider />

                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 1 }}>
                            <TextField type="file" label="โลโก้" fullWidth InputLabelProps={{ shrink: true }} onChange={handleLogoChange} />

                            <Autocomplete
                                options={["Kanit", "Sarabun", "Prompt", "Mitr"]}
                                value={fontFamily}
                                onChange={(event, newValue) => setFontFamily(newValue || "Kanit")}
                                renderInput={(params) => <TextField {...params} label="ฟอนต์" />}
                                fullWidth
                            />

                            <Typography variant="body2">สีธีม</Typography>
                            <Typography variant="caption" color="textSecondary">
                                เลือกสีหลัก/หัวข้อ
                            </Typography>
                            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                {colorPaletteDefault.map((color) => (
                                    <Box
                                        key={color}
                                        onClick={(e) => setPrimaryColor(color)}
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: "50%",
                                            bgcolor: color,
                                            cursor: "pointer",
                                            border: primaryColor === color ? "2px solid black" : "2px solid transparent",
                                        }}
                                    />
                                ))}
                                {/* ปุ่ม + */}
                                <Box
                                    onClick={(e) => handleOpenColorPicker(e, "primary")}
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: "50%",
                                        bgcolor: primaryColor,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: "pointer",
                                        border: "2px solid transparent",
                                    }}
                                >
                                    <Add />
                                </Box>
                            </Box>

                            <Typography variant="caption" color="textSecondary">
                                เลือกสีพื้นหลัง
                            </Typography>
                            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                {colorPaletteDefault.map((color) => (
                                    <Box
                                        key={color}
                                        onClick={(e) => setSecondColor(color)}
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: "50%",
                                            bgcolor: color,
                                            cursor: "pointer",
                                            border: secondColor === color ? "2px solid black" : "2px solid transparent",
                                        }}
                                    />
                                ))}
                                {/* ปุ่ม + */}
                                <Box
                                    onClick={(e) => handleOpenColorPicker(e, "second")}
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: "50%",
                                        bgcolor: secondColor,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: "pointer",
                                        border: "2px solid transparent",
                                    }}
                                >
                                    <Add />
                                </Box>
                            </Box>

                            <Button
                                sx={{
                                    flexGrow: 1,
                                    textTransform: "none",
                                    borderRadius: 3,
                                    boxShadow: "none",
                                    color: "#fff",
                                    fontSize: 14,
                                    "&:hover": {
                                        boxShadow: "none",
                                    },
                                }}
                                variant="contained"
                                color="primary"
                                onClick={() => setOpenThemeMenu(false)}
                            >
                                บันทึก
                            </Button>
                        </Box>

                        {/* Popover สำหรับเลือกสี */}
                        <Popover
                            open={colorPickerOpen}
                            anchorEl={colorAnchorEl}
                            onClose={handleCloseColorPicker}
                            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                            transformOrigin={{ vertical: "top", horizontal: "center" }}
                        >
                            <SketchPicker color={colorPickerTarget === "primary" ? primaryColor : secondColor} onChange={handleChangeColor} />
                        </Popover>
                    </Box>
                )
            }


        </Box >
    );
};

export default FormCreatePage;
