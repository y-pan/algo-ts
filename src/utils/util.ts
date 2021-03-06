import {Func} from "../types/Func";
import {nlb} from "../types/Nullable";
import {Cell} from "../astar/Cell";
import {requireNonNull} from "./Type";


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

export function compare<T>(val1: T, val2: T): -1 | 0 | 1 {
    // compare(va1, val2) => -1 if val1 is smaller
    if (val1 == null && val2 == null) return 0;
    if (val1 == null) return -1;
    if (val2 == null) return 1;
    if (val1 < val2) return -1;
    if (val1 === val2) return 0;
    return 1;
}

export function compareWith<T, K extends string | number | undefined | null>(obj1: T, obj2: T, keyExtractor: Func<nlb<T>, nlb<K>>): -1 | 0 | 1 {
    const key1 = keyExtractor(obj1);
    const key2 = keyExtractor(obj2);
    return compare(key1, key2);
}

export function heuristic(cell1: Cell, cell2: Cell) {
    requireNonNull(cell1, "heuristic cell1 cannot be null");
    requireNonNull(cell2, "heuristic cell2 cannot be null");

    return dist(cell1.col, cell1.row, cell2.col, cell2.row);
}

export function dist(x1: number, y1: number,
                     x2: number, y2: number): number {
    let dx = Math.abs(x2 - x1);
    let dy = Math.abs(y2 - y1);
    return Math.sqrt(dx * dx + dy * dy);
}

export function evalOr<T>(func: () => T, defaultVal: T = null): T {
    try {
        const val = func();
        return val == null ? defaultVal : val;
    } catch (e) {
        return defaultVal;
    }
}