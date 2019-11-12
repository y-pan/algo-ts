import {LinkNode} from "./LinkNode";
import {nlb} from "../types/Nullable";

export abstract class AbstractList<T> {
    protected _size: number = 0;
    protected _root: nlb<LinkNode<T>>;

    protected constructor() {
        this._size = 0;
    }

    abstract add(val: T): void;

    pop(): T {// pop from the head
        if (!this._root) throw new Error("No such element");
        const val = this._root.value;
        this._root = this._root.next;
        this._size--;
        return val;
    }

    size(): number {
        return this._size;
    }

    isEmpty(): boolean {
        return !this._root;
    }

    forEach(consumer: (val: T, index: number) => void): void {
        let node = this._root;
        let idx: number = 0;
        while (node != null) {
            consumer(node.value, idx++);
            node = node.next;
        }
    }


}