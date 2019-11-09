export function isNull(val: any): boolean {
    return val === null || val === undefined;
}

export function notNull(val: any): boolean {
    return !isNull(val);
}

const ALPHABET: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";// 52

export function getRandomAlpha(): string {
    // A-Z: [65-90]; a-z: [97-122]
    const i: number = getRandomInt(0, 52); // [0 ~ 51]
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