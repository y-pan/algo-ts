export function requireNonNull<T>(val: T | undefined | null, failureMessage: string = "Require non-null failure"): T {
    if (val === undefined || val === null) throw new Error(failureMessage);
    return val;
}

export function requireTrue(val: boolean | undefined | null, failureMessage: string = "Require true failure"): boolean {
    if (!val) throw new Error(failureMessage);
    return val;
}

export function requireFalse(val: boolean | undefined | null, failureMessage: string = "Require false failure"): boolean {
    return requireTrue(!val, failureMessage)
}

export function requireEqual<T>(val1: T, val2: T, failureMessage: string = `Require equal failure: ${val1} vs ${val2}`): void {
    if (val1 !== val2) throw new Error(failureMessage);
}

export function requireNotEqual<T>(val1: T, val2: T, failureMessage: string = `Require not-equal failure: ${val1} vs ${val2}`): void {
    if (val1 === val2) throw new Error(failureMessage);
}
