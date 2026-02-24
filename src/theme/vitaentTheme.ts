import { createTheme } from "@mui/material/styles";

export const vitaentTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#7D9ED8",
      light: "#AFC5E9",
      dark: "#6488C5",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#8EA4D7",
      light: "#B8C5E6",
      dark: "#748EC6",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#F3F5FA",
      paper: "#F9FBFF",
    },
    text: {
      primary: "#2F3B54",
      secondary: "#7A869C",
    },
    divider: "#E6EAF3",
  },
  shape: {
    borderRadius: 20,
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
    h1: {
      fontSize: "clamp(3rem, 8.5vw, 5rem)",
      fontWeight: 700,
      lineHeight: 1,
      letterSpacing: "-0.03em",
      color: "#2D3A56",
    },
    h2: {
      fontSize: "clamp(2rem, 5.5vw, 3rem)",
      fontWeight: 700,
      lineHeight: 1.1,
      letterSpacing: "-0.02em",
      color: "#2D3A56",
    },
    h5: {
      fontWeight: 600,
      letterSpacing: "-0.01em",
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 500,
      color: "#55627B",
    },
    body2: {
      fontSize: "0.95rem",
      color: "#7A869C",
    },
    caption: {
      fontSize: "0.8rem",
      fontWeight: 500,
      color: "#8E98AB",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shadows: [
    "none",
    "0 8px 24px rgba(62, 78, 114, 0.06)",
    "0 10px 28px rgba(62, 78, 114, 0.08)",
    "0 12px 32px rgba(62, 78, 114, 0.1)",
    "0 14px 36px rgba(62, 78, 114, 0.11)",
    "0 16px 40px rgba(62, 78, 114, 0.12)",
    "0 18px 44px rgba(62, 78, 114, 0.13)",
    "0 20px 48px rgba(62, 78, 114, 0.14)",
    "0 22px 52px rgba(62, 78, 114, 0.15)",
    "0 24px 56px rgba(62, 78, 114, 0.16)",
    "0 26px 60px rgba(62, 78, 114, 0.17)",
    "0 28px 64px rgba(62, 78, 114, 0.18)",
    "0 30px 68px rgba(62, 78, 114, 0.19)",
    "0 32px 72px rgba(62, 78, 114, 0.2)",
    "0 34px 76px rgba(62, 78, 114, 0.21)",
    "0 36px 80px rgba(62, 78, 114, 0.22)",
    "0 38px 84px rgba(62, 78, 114, 0.23)",
    "0 40px 88px rgba(62, 78, 114, 0.24)",
    "0 42px 92px rgba(62, 78, 114, 0.25)",
    "0 44px 96px rgba(62, 78, 114, 0.26)",
    "0 46px 100px rgba(62, 78, 114, 0.27)",
    "0 48px 104px rgba(62, 78, 114, 0.28)",
    "0 50px 108px rgba(62, 78, 114, 0.29)",
    "0 52px 112px rgba(62, 78, 114, 0.3)",
    "0 54px 116px rgba(62, 78, 114, 0.31)",
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#F3F5FA",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#F6F8FD",
          color: "#2F3B54",
          boxShadow: "0 2px 14px rgba(62, 78, 114, 0.06)",
          borderBottom: "1px solid #E7ECF5",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#F7F9FD",
          borderRight: "1px solid #E7ECF5",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          boxShadow: "0 12px 32px rgba(62, 78, 114, 0.08)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          paddingLeft: 18,
          paddingRight: 18,
          "&:focus-visible": {
            outline: "2px solid #5F7FB8",
            outlineOffset: 2,
          },
        },
        containedPrimary: {
          backgroundColor: "#8CA7DC",
          color: "#FFFFFF",
          boxShadow: "none",
          "&:hover": {
            backgroundColor: "#7F9CD4",
            boxShadow: "none",
          },
        },
        outlinedPrimary: {
          borderColor: "#B7C7E6",
          color: "#556FA5",
          "&:hover": {
            borderColor: "#AFC1E2",
            backgroundColor: "rgba(140, 167, 220, 0.08)",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          "&:focus-visible": {
            outline: "2px solid #5F7FB8",
            outlineOffset: 1,
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          marginBottom: 4,
          "&.Mui-selected": {
            backgroundColor: "#E7EEFA",
            color: "#2F3B54",
          },
          "&.Mui-selected:hover": {
            backgroundColor: "#DFE8F8",
          },
          "&:focus-visible": {
            outline: "2px solid #5F7FB8",
            outlineOffset: -1,
          },
        },
      },
    },
  },
});
