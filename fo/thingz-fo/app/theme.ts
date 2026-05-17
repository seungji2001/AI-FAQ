import { createTheme } from "@mui/material/styles";
import { dim } from "@/lib/styles/typography";
import { INK, INK_LIGHT, IVORY } from "@/lib/constants/theme";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main:         INK,
      dark:         INK_LIGHT,
      contrastText: IVORY,
    },
    background: {
      default: "#F5F0E8",
      paper:   "#FDFAF4",
    },
    text: {
      primary:   INK,
      secondary: "#6B6B6B",
    },
    divider: "rgba(0,0,0,0.08)",
  },
  shape: {
    borderRadius: 12,  // dim.radiusCard 기준으로 통일
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "sans-serif",
    ].join(","),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: dim.radiusCard,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          borderRadius: dim.radiusCard,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: dim.radiusMd,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: dim.radiusCard,
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "rgba(0,0,0,0.08)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          backgroundColor: "#F5F0E8",
          color: INK,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: "#E8E4DC",
          color: "#6B6B6B",
        },
      },
    },
  },
});

export default theme;
