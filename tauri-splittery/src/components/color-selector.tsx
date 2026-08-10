import {
    Box,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";

interface ColorSelectorProps {
    color: string;
    setColor: (color: string) => void;
}

export function ColorSelector({ color, setColor }: ColorSelectorProps) {
    return (
        <>
            <PresetColorPalette color={color} setColor={setColor} />
            <CustomColorInput color={color} setColor={setColor} />
        </>
    );
}

interface CustomColorInputProps {
    color: string;
    setColor: (color: string) => void;
}

function CustomColorInput({ color, setColor }: CustomColorInputProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <>
            <Typography variant="subtitle2" gutterBottom>
                Custom Color
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                }}
            >
                {!isMobile && (
                    <TextField
                        type="color"
                        value={color}
                        onChange={(e) => {
                            setColor(e.target.value);
                        }}
                        sx={{ width: 60 }}
                    />
                )}
                <TextField
                    label="Hex Color"
                    value={color}
                    onChange={(e) => {
                        setColor(e.target.value);
                    }}
                    size="small"
                    fullWidth
                />
            </Box>
        </>
    );
}

interface PresetColorPaletteProps {
    color: string;
    setColor: (color: string) => void;
}

function PresetColorPalette({
    color: selectedColor,
    setColor,
}: PresetColorPaletteProps) {
    const DEFAULT_COLORS = [
        "#f44336",
        "#e91e63",
        "#9c27b0",
        "#673ab7",
        "#3f51b5",
        "#2196f3",
        "#03a9f4",
        "#00bcd4",
        "#009688",
        "#4caf50",
        "#8bc34a",
        "#cddc39",
        "#ffeb3b",
        "#ffc107",
        "#ff9800",
        "#ff5722",
        "#795548",
        "#607d8b",
    ];

    return (
        <>
            <Typography variant="subtitle2" gutterBottom>
                Preset Colors
            </Typography>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(6, 1fr)",
                    gap: 1,
                    mb: 2,
                }}
            >
                {DEFAULT_COLORS.map((color) => (
                    <Box
                        key={color}
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            bgcolor: color,
                            color: "primary.main",
                            border: "2px solid",
                            borderColor:
                                selectedColor === color
                                    ? "primary.main"
                                    : "divider",
                            boxShadow:
                                selectedColor === color ? "0 0 0 2px" : "none",
                            cursor: "pointer",
                            "&:hover": {
                                transform: "scale(1.1)",
                            },
                            transition: "all 0.2s",
                        }}
                        onClick={() => setColor(color)}
                    />
                ))}
            </Box>
        </>
    );
}
