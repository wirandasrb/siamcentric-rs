import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

const ModalConfirm = ({ open, onClose, onConfirm, title = "ยืนยันการดำเนินการ", description = "คุณแน่ใจหรือว่าต้องการดำเนินการนี้?" }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            sx={{ '& .MuiDialog-paper': { borderRadius: 3 } }}
            size="sm"
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {description}
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{
                padding: 2
            }}>
                <Button onClick={onClose} color="error" >
                    ยกเลิก
                </Button>
                <Button
                    onClick={onConfirm}
                    color="primary"
                    variant="contained"
                    sx={{
                        borderRadius: 3,
                        boxShadow: 'none',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: 'primary.dark',
                            boxShadow: 'none',
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
