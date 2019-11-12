import {Heap} from "./Heap";
import {nlb} from "../types/Nullable";
import {compare} from "../utils/util";

export class MinHeap<T extends number | string> extends Heap<T> {
    constructor() {
        super((v1: nlb<T>, v2: nlb<T>) => compare(v1, v2))
    }
}
