"use client";

import { createMember } from "@/actions/create-member-service";
import { createSplit } from "@/actions/create-split-service";
import { CreateSplitDto } from "@/utils/split";
import { CreateMemberDto } from "@/utils/user";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import LoginIcon from "@mui/icons-material/Login";
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Step,
    StepLabel,
    Stepper,
    Typography,
} from "@mui/material";
import { useState } from "react";
import MemberForm from "../splits/[splitId]/balances/components/member-form";
import SplitForm from "./split-form";

interface CreateSplitDialogProps {
    open: boolean;
    onClose: () => void;
    loading?: boolean;
}

export function CreateSplitDialog(props: CreateSplitDialogProps) {
    const { open, onClose } = props;

    const [split, setSplit] = useState<CreateSplitDto>({ name: "" });
    const [member, setMember] = useState<CreateMemberDto>({ name: "" });
    const [error, setError] = useState<string | null>(null);

    const handleCancel = () => {
        setSplit({ name: "" });
        setMember({ name: "" });
        setError(null);
        onClose();
    };

    const handleSubmit = async () => {
        const trimmedSplit = { ...split, name: split.name.trim() };
        const trimmedMember = { ...member, name: member.name.trim() };

        try {
            const newSplit = await createSplit(trimmedSplit);
            await createMember(trimmedMember, newSplit.id);
            window.location.href = `/splits/${newSplit.id}/balances`;
        } catch {
            setError(
                "Failed to create split and add member. Please try again."
            );
        }
    };

    return (
        <Dialog open={open} onClose={handleCancel}>
            <StepperForm
                split={split}
                setSplit={setSplit}
                member={member}
                setMember={setMember}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                error={error}
            />
        </Dialog>
    );
}

interface StepperFormProps {
    split: CreateSplitDto;
    setSplit: (split: CreateSplitDto) => void;
    member: CreateMemberDto;
    setMember: (member: CreateMemberDto) => void;
    onSubmit: () => Promise<void>;
    onCancel: () => void;
    error: string | null;
}

function StepperForm({
    split,
    setSplit,
    member,
    setMember,
    onSubmit,
    error,
}: StepperFormProps) {
    const [activeStep, setActiveStep] = useState(0);

    const nextStep = () => {
        setActiveStep((prev) => prev + 1);
    };

    const prevStep = () => {
        setActiveStep((prev) => Math.max(prev - 1, 0));
    };

    return (
        <Box sx={{ minWidth: "380px" }}>
            {(() => {
                switch (activeStep) {
                    case 0:
                        return <Step0 nextStep={nextStep} />;
                    case 1:
                        return (
                            <Step1
                                split={split}
                                setSplit={setSplit}
                                nextStep={nextStep}
                                prevStep={prevStep}
                            />
                        );
                    case 2:
                        return (
                            <Step2
                                member={member}
                                setMember={setMember}
                                nextStep={async () => await onSubmit()}
                                prevStep={prevStep}
                                error={error}
                            />
                        );
                    default:
                        return null;
                }
            })()}
        </Box>
    );
}

function StepperHeader({ activeStep }: { activeStep: number }) {
    const steps = ["Create Split", "Add Member"];

    return (
        <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{ padding: 2, paddingTop: 4, backgroundColor: "transparent" }}
        >
            {steps.map((label) => (
                <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                </Step>
            ))}
        </Stepper>
    );
}
interface Step0Props {
    nextStep: () => void;
}

function Step0({ nextStep }: Step0Props) {
    return (
        <Box sx={{ display: "flex", gap: 2, p: 2 }}>
            <Button
                disabled
                variant="outlined"
                sx={{
                    flex: 1,
                    flexDirection: "column",
                    padding: 3,
                    gap: 1,
                }}
            >
                <LoginIcon sx={{ fontSize: 40 }} />
                <Typography>Join existing split</Typography>
            </Button>
            <Button
                variant="outlined"
                onClick={nextStep}
                sx={{
                    flex: 1,
                    flexDirection: "column",
                    padding: 3,
                    gap: 1,
                }}
            >
                <FiberNewIcon sx={{ fontSize: 40 }} />
                <Typography>Create a new split</Typography>
            </Button>
        </Box>
    );
}

interface Step1Props {
    split: CreateSplitDto;
    setSplit: (split: CreateSplitDto) => void;
    nextStep: () => void;
    prevStep: () => void;
}

function Step1({ split, setSplit, nextStep, prevStep }: Step1Props) {
    const handleSubmit = async (split: CreateSplitDto) => {
        if (!split.name.trim()) return;
        nextStep();
    };

    return (
        <SplitForm.Root
            split={split}
            setSplit={setSplit}
            onSubmit={handleSubmit}
            onCancel={prevStep}
        >
            <DialogTitle>
                <SplitForm.Title />
                <StepperHeader activeStep={0} />
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <SplitForm.Description />
                </DialogContentText>
                <div style={{ marginTop: "16px" }} />
                <SplitForm.FormInputs />
            </DialogContent>
            <DialogActions>
                <Button onClick={prevStep} color="secondary">
                    Back
                </Button>
                <SplitForm.SubmitButton content="Next" />
            </DialogActions>
        </SplitForm.Root>
    );
}

interface Step2Props {
    member: CreateMemberDto;
    setMember: (member: CreateMemberDto) => void;
    nextStep: () => void;
    prevStep: () => void;
    error: string | null;
}

function Step2({ member, setMember, nextStep, prevStep, error }: Step2Props) {
    const handleMemberSubmit = async (member: CreateMemberDto) => {
        if (!member.name.trim()) return;
        nextStep();
    };

    return (
        <MemberForm.Root
            member={member}
            setMember={setMember}
            onSubmit={handleMemberSubmit}
            onCancel={prevStep}
        >
            <DialogTitle>
                <MemberForm.Title />
                <StepperHeader activeStep={1} />
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Add the first member to your split.
                </DialogContentText>
                <div style={{ marginTop: "16px" }} />
                <MemberForm.FormInputs />
                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={prevStep} color="secondary">
                    Back
                </Button>
                <MemberForm.SubmitButton />
            </DialogActions>
        </MemberForm.Root>
    );
}
