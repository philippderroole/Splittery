import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { alpha, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#14532d",
      light: "#dcfce7",
      dark: "#052e16",
      contrastText: "#ffffff",
    },
    secondary: { main: "#c2410c" },
    background: { default: "#f4f7f3", paper: "#ffffff" },
    text: { primary: "#17211b", secondary: "#617066" },
    divider: "#dbe5dc",
  },
  typography: {
    fontFamily: 'Roboto, "Helvetica Neue", sans-serif',
    h3: { fontWeight: 700, letterSpacing: "0" },
    h4: { fontWeight: 700, letterSpacing: "0" },
    button: { fontWeight: 700, letterSpacing: "0" },
  },
  shape: { borderRadius: 14 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: "#f4f7f3" },
        "*": { boxSizing: "border-box" },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "1px solid #dbe5dc",
          boxShadow: "0 8px 28px rgba(20, 83, 45, 0.07)",
        },
      },
    },
    MuiButton: {
      styleOverrides: { root: { minHeight: 44, borderRadius: 12 } },
    },
    MuiIconButton: { styleOverrides: { root: { borderRadius: 12 } } },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          height: "calc(64px + env(safe-area-inset-bottom))",
          paddingBottom: "env(safe-area-inset-bottom)",
          borderTop: "1px solid #dbe5dc",
          boxShadow: "0 -8px 24px rgba(20, 83, 45, 0.08)",
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          minWidth: 0,
          padding: "8px 4px 6px",
          color: "#617066",
          "&.Mui-selected": { color: "#14532d" },
        },
        label: { fontSize: "0.7rem", fontWeight: 700 },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          minHeight: 64,
          paddingLeft: 16,
          paddingRight: 16,
          "&:hover": { backgroundColor: alpha("#14532d", 0.05) },
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);
