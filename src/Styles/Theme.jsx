import { createTheme } from '@mui/material/styles';
const Theme = createTheme({
  palette: {
    primary: {
      light: "#0066CC",
      main: "#0066CC",
      dark: "#0066CC",
      contrastText: "#e0f2f1",
    },
    secondary: {
      light: "#004080",
      main: "#004080",
      dark: "#004080",
      contrastText: "#000",
    },
  },
  components: {
    MuiTextField: {
      defaultProps: {
        margin: 'dense',
      },
    },
  },
  typography: {
    // In Chinese and Japanese the characters are usually larger,
    // so a smaller fontsize may be appropriate.
    //fontSize: 12,
  },
});
export default Theme;