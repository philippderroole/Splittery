import { Container, Stack } from "@mui/material";

export function Welcome() {
    return (
        <Container color="red">
            <NavigationBar></NavigationBar>
        </Container>
    );
}

function NavigationBar() {
    return (
        <Stack direction="row">
            <p>hallo</p>
            <p>hallo</p>
        </Stack>
    );
}
