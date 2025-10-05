import { Apps, CheckBox, Circle, Event, ExpandCircleDown, FileUpload, LinearScale, Notes, PowerInput, Schedule, ShortText, StarHalf } from "@mui/icons-material";

export const questionTypes = [
    { id: 1, label: "ข้อความสั้น", icon: <ShortText /> },
    { id: 2, label: "ข้อความยาว", icon: <Notes /> },
    { id: 3, label: "ตัวเลือกเดียว", icon: <Circle /> },
    { id: 4, label: "หลายตัวเลือก", icon: <CheckBox /> },
    { id: 5, label: "เลื่อนลง", icon: <ExpandCircleDown /> },
    { id: 6, label: "คะแนน", icon: <StarHalf /> },
    { id: 7, label: "สเกลเชิงเส้น", icon: <LinearScale /> },
    { id: 8, label: "สเกลบาร์", icon: <PowerInput /> },
    { id: 9, label: "เมทริกซ์", icon: <Apps /> },
    { id: 10, label: "อัปโหลดไฟล์", icon: <FileUpload /> },
    { id: 11, label: "วันที่", icon: <Event /> },
    { id: 12, label: "เวลา", icon: <Schedule /> },
];