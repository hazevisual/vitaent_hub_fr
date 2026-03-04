import { alpha, createTheme } from "@mui/material/styles";

const uiSpacing = (...args: Array<number | string>) => {
  if (args.length === 0) {
    return "0px";
  }

  return args
    .map((arg) => {
      if (typeof arg === "string") {
        return arg;
      }

      if (arg === 0) {
        return "0px";
      }

      return `${arg * 8}px`;
    })
    .join(" ");
};

const tokens = {
  shell: "#EEEDEF",
  chrome: "#F5F5F7",
  surface: "#FBFBFD",
  contrastSurface: "#FFFFFF",
  textPrimary: "#333333",
  textSecondary: "#838384",
  border: "#C8C8CC",
  divider: "#EEEDEF",
  blue: "#336FEE",
  blueIndicator: "#1E82F5",
  red: "#FF4163",
  black: "#070708",
};

export const vitaentTheme = createTheme({
  spacing: uiSpacing,
  shape: {
    borderRadius: 10,
  },
  palette: {
    mode: "light",
    primary: {
      main: tokens.blue,
      light: alpha(tokens.blue, 0.12),
      dark: "#255DDA",
      contrastText: tokens.contrastSurface,
    },
    error: {
      main: tokens.red,
      contrastText: tokens.contrastSurface,
    },
    background: {
      default: tokens.shell,
      paper: tokens.surface,
    },
    text: {
      primary: tokens.textPrimary,
      secondary: tokens.textSecondary,
    },
    divider: tokens.divider,
  },
  typography: {
    fontFamily: '"Lato", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontSize: "4rem",
      fontWeight: 600,
      lineHeight: 1,
      color: tokens.textPrimary,
    },
    h2: {
      fontSize: "2.25rem",
      fontWeight: 600,
      lineHeight: 1.25,
      color: tokens.textPrimary,
    },
    h5: {
      fontSize: "1.0625rem",
      fontWeight: 600,
      lineHeight: 1.2,
      color: tokens.textPrimary,
    },
    subtitle1: {
      fontSize: "0.9375rem",
      fontWeight: 600,
      lineHeight: 1.2,
      color: tokens.textPrimary,
    },
    subtitle2: {
      fontSize: "0.8125rem",
      fontWeight: 600,
      lineHeight: 1.2,
      color: tokens.textPrimary,
    },
    body1: {
      fontSize: "0.9375rem",
      fontWeight: 400,
      lineHeight: 1.45,
      color: tokens.textPrimary,
    },
    body2: {
      fontSize: "0.8125rem",
      fontWeight: 400,
      lineHeight: 1.4,
      color: tokens.textSecondary,
    },
    caption: {
      fontSize: "0.8125rem",
      fontWeight: 400,
      lineHeight: 1.25,
      color: tokens.textSecondary,
    },
    button: {
      fontSize: "0.8125rem",
      fontWeight: 600,
      lineHeight: 1,
      textTransform: "none",
    },
  },
  shadows: Array(25).fill("none") as [
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none"
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ":root": {
          colorScheme: "light",
          fontSynthesis: "none",
          textRendering: "optimizeLegibility",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          "--vitaent-shell-bg": tokens.shell,
          "--vitaent-chrome-bg": tokens.chrome,
          "--vitaent-surface-bg": tokens.surface,
          "--vitaent-contrast-surface": tokens.contrastSurface,
          "--vitaent-border": tokens.border,
          "--vitaent-text-primary": tokens.textPrimary,
          "--vitaent-text-secondary": tokens.textSecondary,
          "--vitaent-blue": tokens.blue,
          "--vitaent-blue-indicator": tokens.blueIndicator,
          "--vitaent-red": tokens.red,
          "--vitaent-black": tokens.black,
        },
        "html, body, #root": {
          width: "100%",
          minHeight: "100%",
        },
        "html, body": {
          overflowX: "hidden",
          backgroundColor: tokens.shell,
        },
        "*, *::before, *::after": {
          boxSizing: "border-box",
        },
        body: {
          margin: 0,
          minHeight: "100vh",
          color: tokens.textPrimary,
          backgroundColor: tokens.shell,
        },
        a: {
          color: tokens.blue,
          textDecoration: "none",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: tokens.chrome,
          color: tokens.textPrimary,
          boxShadow: "none",
          borderBottom: `1px solid ${tokens.border}`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: tokens.surface,
          borderRight: `1px solid ${tokens.divider}`,
          backgroundImage: "none",
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
          boxShadow: "none",
          backgroundImage: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: 38,
          borderRadius: 10,
          padding: "10px 18px",
          boxShadow: "none",
        },
        containedPrimary: {
          backgroundColor: tokens.blue,
          color: tokens.contrastSurface,
          "&:hover": {
            backgroundColor: "#255DDA",
            boxShadow: "none",
          },
        },
        outlinedPrimary: {
          borderColor: tokens.blue,
          color: tokens.blue,
          "&:hover": {
            borderColor: tokens.blue,
            backgroundColor: alpha(tokens.blue, 0.06),
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: tokens.textSecondary,
          "&:hover": {
            backgroundColor: alpha(tokens.blue, 0.06),
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          position: "relative",
          minHeight: 46,
          borderRadius: 10,
          "&:hover": {
            backgroundColor: tokens.contrastSurface,
          },
          "&.Mui-selected": {
            backgroundColor: tokens.contrastSurface,
          },
          "&.Mui-selected:hover": {
            backgroundColor: tokens.contrastSurface,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          backgroundColor: tokens.contrastSurface,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: tokens.border,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: tokens.blue,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: tokens.blue,
            borderWidth: 1,
          },
        },
        input: {
          paddingTop: 11,
          paddingBottom: 11,
        },
      },
    },
  },
});
