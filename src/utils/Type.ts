export function requireNonNull<T>(val: T | undefined | null, failureMessage: string = "Require non-null"): T {
    if (val === undefined || val === null) throw new Error(failureMessage);
    return val;
}

export function requireTrue(val: boolean | undefined | null, failureMessage: string = "Require true"): boolean {
    if (!val) throw new Error(failureMessage);
    return val;
}

export function requireFalse(val: boolean | undefined | null, failureMessage: string = "Require false"): boolean {
    return requireTrue(!val, failureMessage)
}
