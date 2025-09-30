import { Box, Typography } from "@mui/material";

const CarComponent = ({ title, content }) => {
    return (
        <Box sx={{
            backgroundColor: "white",
            borderRadius: 2,
            boxShadow: 3,
            p: 2,
            minWidth: 275,
        }}>
            <Typography variant="h6" component="div" gutterBottom>
                {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {content}
            </Typography>
        </Box>
    );
}
export default CarComponent;