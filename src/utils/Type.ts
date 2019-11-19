const throwErrorObj: boolean = false;

export function requireNonNull<T>(val: T | undefined | null, failureMessage: string = "Require non-null failure"): T {
    if (val === undefined || val === null) throw throwErrorObj ? new Error(failureMessage) : failureMessage;
    return val;
}

export function requireAllNonNull<T>(...vals: T[]): T[] {
    const failureMessage: string = "Require all-non-null failure";
    if (isEmptyOrHasNull(vals)) throw throwErrorObj ? new Error(failureMessage) : failureMessage;
    return vals;
}

export function isEmptyOrHasNull(...vals: any[]): boolean {
    if (!vals || vals.length === 0) return true;
    for (let val of vals) {
        if (isNull(val)) return true;
    }
    return false;
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

export function requireFunction<T>(func: T, failureMessage: string = "Require function failure"): T {
    if (!func || typeof func !== "function") throw throwErrorObj ? new Error(failureMessage) : failureMessage;
    return func;
}

export function isNull(val: any): boolean {
    return val === null || val === undefined;
}

export function notNull(val: any): boolean {
    return !isNull(val);
}

export function arrayOfNonNull<T>(...vals: T[]): T[] {
    return asArray(...vals).filter(v => v != null);
}

export function asArray<T>(...vals: T[]): T[] {
    if (!vals) return [];
    return vals;
}

export function asNumber(val: number, defaultVal: number = 0): number {
    if (isNull(val) || isNaN(val)) return defaultVal;
    return val;
}