export function requireNonNull<T>(val: T | undefined | null, errorMessage: string = "Require non-null"): T {
    if (val === undefined || val === null) throw errorMessage;
    return val;
}