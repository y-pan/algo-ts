import {Nullable} from "../../types/Nullable";

export interface ITreeNode<K, V> {
    getKey(): K;
    getVal(): V;

    // add(key: K, val: V): void;
    getLeft(): Nullable<ITreeNode<K, V>>;
    getRight(): Nullable<ITreeNode<K, V>>

    setVal(val: V): void;
    setLeft(left: Nullable<ITreeNode<K, V>>): void;
    setRight(right: Nullable<ITreeNode<K, V>>): void;

    getSize(): number;
    setSize(size: number): void;
}