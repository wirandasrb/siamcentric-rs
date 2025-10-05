import { Favorite, Mood, Star, ThumbUp } from "@mui/icons-material";

export const ratingTypes = [
    {
        id: 1,
        value: "star",
        label: "ดาว",
        icon: <Star sx={{ color: "#fbc02d" }} />,
    },
    {
        id: 2,
        value: "smiley",
        label: "รูปยิ้ม",
        icon: (
            <Mood
                sx={{
                    color: "#558b2f",
                }}
            />
        ),
    },
    {
        id: 3,
        value: "thumbs",
        label: "ปลายนิ้ว",
        icon: (
            <ThumbUp
                sx={{
                    color: "#1e88e5",
                }}
            />
        ),
    },
    {
        id: 4,
        value: "heart",
        label: "หัวใจ",
        icon: <Favorite sx={{ color: "red" }} />,
    },
];
