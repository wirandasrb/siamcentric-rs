import { Alert, Snackbar } from "@mui/material";

const SnackbarCustomized = ({
    open,
    message,
    severity,
    onClose,
    autoHideDuration = 5000,
    vertical = "top",
    horizontal = "center"
}) => {
    return (
        <Snackbar
            open={open}
            message={message}
            onClose={onClose}
            autoHideDuration={autoHideDuration}
            anchorOrigin={{ vertical, horizontal }}
        >
            <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default SnackbarCustomized;