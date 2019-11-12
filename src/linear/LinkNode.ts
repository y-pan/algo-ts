import {nlb} from "../types/Nullable";

export class LinkNode<T> {
    private readonly _value: T;
    private _next: nlb<LinkNode<T>>;

    constructor(value: T) {
        this._value = value;
    }

    get value(): T {
        return this._value;
    }

    get next(): nlb<LinkNode<T>> {
        return this._next;
    }

    set next(nextNode: nlb<LinkNode<T>>) {
        this._next = nextNode;
    }
}