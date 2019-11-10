const throwErrorObj: boolean = false;

export function requireNonNull<T>(val: T | undefined | null, failureMessage: string = "Require non-null failure"): T {
    if (val === undefined || val === null) throw throwErrorObj ? new Error(failureMessage) : failureMessage;
    return val;
}

export function requireTrue(val: boolean | undefined | null, failureMessage: string = "Require true failure"): boolean {
    if (!val) throw throwErrorObj ? new Error(failureMessage) : failureMessage;
    return val;
}

export function requireFalse(val: boolean | undefined | null, failureMessage: string = "Require false failure"): boolean {
    return requireTrue(!val, failureMessage)
}

export function requireEqual<T>(val1: T, val2: T, failureMessage: string = `Require equal failure: ${val1} vs ${val2}`): void {
    if (val1 !== val2) throw throwErrorObj ? new Error(failureMessage) : failureMessage;
}

export function requireNotEqual<T>(val1: T, val2: T, failureMessage: string = `Require not-equal failure: ${val1} vs ${val2}`): void {
    if (val1 === val2) throw throwErrorObj ? new Error(failureMessage) : failureMessage;
}
