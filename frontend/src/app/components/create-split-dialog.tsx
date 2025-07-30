"use client";

import { createMember } from "@/actions/member-service";
import { createSplit } from "@/actions/split-service";
import MobileDialog from "@/components/mobile-dialog";
import { CreateSplitDto } from "@/utils/split";
import { CreateMemberDto, CreateMemberWithTagsDto } from "@/utils/user";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import LoginIcon from "@mui/icons-material/Login";
import {
    Alert,
    Box,
    Button,
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
import MemberForm from "../../components/member-form";
import SplitForm from "../../components/split-form";

interface CreateSplitDialogProps {
    open: boolean;
    onClose: () => void;
    loading?: boolean;
}

export function CreateSplitDialog(props: CreateSplitDialogProps) {
    const { open, onClose } = props;

    const [split, setSplit] = useState<CreateSplitDto>({ name: "" });
    const [member, setMember] = useState<CreateMemberWithTagsDto>({
        name: "",
        tagIds: [],
    });
    const [isPending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeStep, setActiveStep] = useState(0);

    const nextStep = () => {
        setActiveStep((prev) => prev + 1);
    };

    const prevStep = () => {
        setActiveStep((prev) => prev - 1);
    };

    const handleSubmit = async () => {
        setPending(true);

        const trimmedSplit = { ...split, name: split.name.trim() };
        const trimmedMember = { ...member, name: member.name.trim() };

        try {
            const newSplit = await createSplit(trimmedSplit);
            await createMember({ ...trimmedMember, tagIds: [] }, newSplit.id);
            window.location.href = `/splits/${newSplit.id}/balances`;
        } catch {
            setError(
                "Failed to create split and add member. Please try again."
            );
            setPending(false);
        }
    };

    const handleCancel = () => {
        setSplit({ name: "" });
        setMember({ name: "", tagIds: [] });
        setPending(false);
        setError(null);
        setActiveStep(0);
        onClose();
    };

    return (
        <MobileDialog open={open} onClose={handleCancel}>
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
                                nextStep={handleSubmit}
                                prevStep={prevStep}
                                error={error}
                                isPending={isPending}
                                setPending={setPending}
                            />
                        );
                    default:
                        return null;
                }
            })()}
        </MobileDialog>
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
    const handleSubmit = async (_split: CreateSplitDto) => {
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
                <SplitForm.CancelButton content="Back" />
                <SplitForm.SubmitButton content="Next" />
            </DialogActions>
        </SplitForm.Root>
    );
}

interface Step2Props {
    member: CreateMemberWithTagsDto;
    setMember: (member: CreateMemberWithTagsDto) => void;
    nextStep: () => Promise<void>;
    prevStep: () => void;
    error: string | null;
    isPending: boolean;
    setPending: (pending: boolean) => void;
}

function Step2({
    member,
    setMember,
    nextStep,
    prevStep,
    error,
    isPending,
}: Step2Props) {
    const handleSubmit = async (member: CreateMemberDto) => {
        if (!member.name.trim()) return;
        await nextStep();
    };

    return (
        <MemberForm.Root
            member={member}
            setMember={setMember}
            onSubmit={handleSubmit}
            onCancel={prevStep}
            showTagSelection={false}
            isPending={isPending}
        >
            <DialogTitle>
                <MemberForm.Title>
                    <>Please enter a username for the new member.</>
                </MemberForm.Title>
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
                <MemberForm.CancelButton content="Back" />
                <MemberForm.SubmitButton>
                    <>Create</>
                </MemberForm.SubmitButton>
            </DialogActions>
        </MemberForm.Root>
    );
}
