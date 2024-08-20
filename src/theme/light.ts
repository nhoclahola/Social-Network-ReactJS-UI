import { createTheme } from "@mui/material";

export const light = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#f0f0f0',
      paper: '#fff',
    },
  },
});