"use client";
import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
    colors: {
        dark: {
            text: {
                main: "#ededee",
            },
            background: {
                main: "#1a202d",
                50: "#8d9096",
                100: "#767981",
                200: "#5f636c",
                300: "#484d57",
                400: "#313642",
                500: "#171d29",
                600: "#151a24",
                700: "#12161f",
                800: "#10131b",
                900: "#0d1017",
            },
            primary: {
                main: "#98e6b5",
                50: "#eafaf0",
                100: "#d6f5e1",
                200: "#adebc4",
                300: "#84e1a6",
                400: "#5bd788",
                500: "#32cd6b",
                600: "#28a455",
                700: "#1e7b40",
                800: "#14522b",
                900: "#0a2915",
            },
            secondary: {
                main: "#9F9FDC",
                50: "#ececf8",
                100: "#dadaf1",
                200: "#b4b4e4",
                300: "#8f8fd6",
                400: "#6969c9",
                500: "#4444bb",
                600: "#363696",
                700: "#292970",
                800: "#1b1b4b",
                900: "#0e0e25",
            },
            accent: {
                main: "#4020C5",
                50: "#ede9fb",
                100: "#dad3f8",
                200: "#b6a7f1",
                300: "#917bea",
                400: "#6d50e2",
                500: "#4824db",
                600: "#3a1daf",
                700: "#2b1584",
                800: "#1d0e58",
                900: "#0e072c",
            },
        },
        light: {
            text: {
                main: "#1a202d",
            },
            background: {
                main: "#FAFDFF",
                50: "#F8FBFD",
                100: "#F6F9FB",
                200: "#f4f7f9",
                300: "#f2f5f7",
                400: "#f0f3f5",
                500: "#eef1f3",
                600: "#ecedef",
                700: "#eaebed",
                800: "#e8e9eb",
                900: "#e6e7e9",
            },
            primary: {
                main: "#53d683",
                50: "#eafaf0",
                100: "#d6f5e1",
                200: "#acecc4",
                300: "#83e2a6",
                400: "#6edd97",
                500: "#5ad888",
                600: "#30cf6a",
                700: "#27a555",
                800: "#1d7c40",
                900: "#13532b",
            },
            secondary: {
                main: "#886dfc",
                50: "#eae6fe",
                100: "#d6cdfe",
                200: "#c1b4fd",
                300: "#ad9bfd",
                400: "#9882fc",
                500: "#8469fc",
                600: "#6f50fb",
                700: "#5b37fb",
                800: "#461efa",
                900: "#3205fa",
            },
            accent: {
                main: "#8d45fb",
                50: "#f0e6fe",
                100: "#e1cdfe",
                200: "#c29bfd",
                300: "#a469fc",
                400: "#8537fb",
                500: "#6705fa",
                600: "#5204c8",
                700: "#3e0396",
                800: "#290264",
                900: "#150132",
            },
        },
    },
});