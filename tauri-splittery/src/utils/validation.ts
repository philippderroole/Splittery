export function validateAmount(amount: number | null) {
    if (amount === null || amount === undefined) {
        return "Amount is required.";
    }
    if (amount < -1000000 || amount > 1000000) {
        return "Amount must be between -1,000,000 and 1,000,000.";
    }
    if (amount === 0) {
        return "Amount cannot be zero.";
    }

    return null;
}

export function validateName(name: string) {
    if (!name) {
        return "Name cannot be empty.";
    }
    if (name.length < 3) {
        return "Name must be at least 3 characters long.";
    }
    if (name.length > 50) {
        return "Name must not exceed 50 characters.";
    }

    return null;
}
