export function isNull(val: any): boolean {
    return val === null || val === undefined;
}
const ALPHABET: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";// 32

export function getRandomAlpha(): string {
    // A-Z: [65-90]; a-z: [97-122]
    const i: number = getRandomInt(0, 33);
    return ALPHABET[i];
}

export function getRandom(min: number, max: number): number { // max not included
    return Math.random() * (max - min) + min;
}

export function getRandomInt(min: number, max: number): number { // max not included
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}