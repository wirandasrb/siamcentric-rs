import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#90caf9",
      dark: "#42a5f5",
    },
    secondary: {
      main: "#00ff00",
      dark: "#1a237e",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "'Prompt', 'Roboto', 'Helvetica', 'Arial', sans-serif",
  },
});

export default theme;
