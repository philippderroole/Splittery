export function validate_name(name: string): string | undefined {
    if (name.length === 0) {
        return "Name is required";
    }

    if (name.length > 32) {
        return "Name can't be longer than 32 characters";
    }
}

export function validate_amount(amount: number): string | undefined {
    if (amount === 0) {
        return "Amount is required";
    }

    if (isNaN(amount)) {
        return "Amount must be a number";
    }

    if (amount < 0) {
        return "Amount can't be negative";
    }

    if (amount > 1000000) {
        return "Amount can't be larger than 1,000,000";
    }
}

export function validate_payer(
    tabIndex: number,
    payerId: number
): string | undefined {
    if (tabIndex === 1) {
        return;
    }

    if (payerId === undefined) {
        return "Please create a user first";
    }
}

export function validate_receiver(
    tabIndex: number,
    payerId: number,
    receiverId: number
): string | undefined {
    if (tabIndex === 0) {
        return;
    }

    if (receiverId === undefined || payerId === undefined) {
        return "Please create a user first";
    }

    if (tabIndex === 2 && payerId === receiverId) {
        return "Payer and receiver can't be the same";
    }
}
