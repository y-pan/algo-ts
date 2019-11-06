export function requireNonNull(obj: any): void {
    if (obj === null || obj === undefined) {
        throw `Required non null`;
    }
}