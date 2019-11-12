import {nlb} from "../types/Nullable";
import {compare} from "../utils/util";
import {Heap} from "./Heap";

export class MaxHeap<T extends number | string> extends Heap<T> {
    constructor() {
        super((v1: nlb<T>, v2: nlb<T>) => compare(v2, v1))
    }
}