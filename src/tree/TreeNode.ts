import {nlb} from "../types/Nullable";

type Node<K, V> = nlb<TreeNode<K, V>>;

export abstract class TreeNode<K, V> {
    protected readonly _key: K;
    protected _value: nlb<V>;
    protected _left: Node<K, V>;
    protected _right: Node<K, V>;
    protected _size: number;

    protected constructor(key: K, value: nlb<V>, size: number = 1) {
        this._key = key;
        this._value = value;
        this._size = size;
    }

    get key(): K {
        return this._key;
    }

    get left(): Node<K, V> {
        return this._left;
    }

    get right(): Node<K, V> {
        return this._right;
    }

    get value(): nlb<V> {
        return this._value;
    }

    set value(value: nlb<V>) {
        this._value = value;
    }

    set left(left: Node<K, V>) {
        this._left = left;
    }

    set right(right: Node<K, V>) {
        this._right = right;
    }

    get size(): number {
        return this._size;
    }

    set size(size: number) {
        this._size = size
    }
}