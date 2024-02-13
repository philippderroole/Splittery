"use client";

import { Editable, EditableInput, EditablePreview } from "@chakra-ui/react";

export default function SplitName({ name }) {
    return (
        <>
            <Editable
                defaultValue={name}
                fontSize="3xl"
                fontWeight="bold"
                width="50%"
                isPreviewFocusable={false}
                textAlign="left">
                <EditablePreview />
                <EditableInput />
            </Editable>
        </>
    );
}
