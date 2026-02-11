import { CheckCircle } from "@mui/icons-material";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";

const ModalConfirm = ({
    open,
    onClose,
    onConfirm,
    title = "ยืนยันการดำเนินการ",
    description = "คุณแน่ใจหรือว่าต้องการดำเนินการนี้?",
    sub_description = null,
}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            sx={{
                "& .MuiDialog-paper": {
                    borderRadius: 3,
                    paddingTop: 1,
                },
            }}
        >
            <DialogTitle
                sx={{
                    textAlign: "center",
                    fontWeight: 600,
                    fontSize: 20,
                    pb: 1,
                }}
            >
                {title}
            </DialogTitle>

            <DialogContent
                sx={{
                    textAlign: "center",
                    px: 4,
                    pt: 1,
                    pb: 2,
                }}
            >
                <DialogContentText
                    sx={{
                        fontSize: 16.5,
                        fontWeight: 500,
                        color: "text.primary",
                        mb: description?.sub ? 1 : 0,
                    }}
                >
                    {description?.main || description}
                </DialogContentText>

                {sub_description && (
                    <DialogContentText
                        sx={{
                            fontSize: 15,
                            color: "error.main",
                            fontWeight: 400,
                        }}
                    >
                        {sub_description}
                    </DialogContentText>
                )}
            </DialogContent>

            <DialogActions
                sx={{
                    justifyContent: "center",
                    gap: 1.5,
                    pb: 2,
                }}
            >
                <Button
                    onClick={onClose}
                    color="error"
                    variant="outlined"
                    sx={{
                        borderRadius: 3,
                        px: 3,
                        fontWeight: 500,
                    }}
                >
                    ยกเลิก
                </Button>
                <Button
                    onClick={onConfirm}
                    color="primary"
                    variant="contained"
                    endIcon={
                        <CheckCircle sx={{ fontSize: 20, color: "white" }} />
                    }
                    sx={{
                        borderRadius: 3,
                        px: 3,
                        boxShadow: "none",
                        fontWeight: 500,
                        minWidth: 100,
                        "&:hover": {
                            backgroundColor: "primary.dark",
                            boxShadow: "none",
                        },
                    }}
                >
                    ยืนยัน
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ModalConfirm;
