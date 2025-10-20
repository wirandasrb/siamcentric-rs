import { Box, Button, Typography } from "@mui/material";

const FileUploadSurvey = ({
    question,
    answer,
    onChange,
    primaryColor,
    secondColor,
}) => {
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Here you would typically upload the file to your server or storage service
            // and get back a URL. For this example, we'll just use a placeholder URL.
            const uploadedFileUrl = URL.createObjectURL(file);
            onChange({
                ...question,
                answer: {
                    section_id: question.section_id,
                    question_id: question.id,
                    answer_option_id: null,
                    answer_value: null,
                    answer_text: file.name,
                    attachment_url: uploadedFileUrl,
                },
            });
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", mt: 2, mb: 2, ml: 1 }}>
            <Button
                variant="outlined"
                component="label"
                sx={{
                    backgroundColor: primaryColor,
                    color: "white",
                    width: 150,
                    borderRadius: 3,
                    '&:hover': {
                        backgroundColor: primaryColor,
                    },

                }}
            >
                {answer?.attachment_url ? "เปลี่ยนไฟล์" : "อัปโหลดไฟล์"}
                <input
                    type="file"
                    hidden
                    onChange={handleFileChange}
                />
            </Button>
            {answer?.attachment_url && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                    ไฟล์ที่อัปโหลด: {answer.answer_text}
                </Typography>
            )}
        </Box>
    );
}
export default FileUploadSurvey;