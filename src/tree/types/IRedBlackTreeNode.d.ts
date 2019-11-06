import {ITreeNode} from "./ITreeNode";
import {Nullable} from "../../types/Nullable";

export interface IRedBlackTreeNode<K, V> extends ITreeNode<K, V> {
    isRed(): boolean;
    setRed(isRed: boolean): void;

    getKey(): K;
    getVal(): V;

    // add(key: K, val: V): void;
    getLeft(): Nullable<IRedBlackTreeNode<K, V>>;
    getRight(): Nullable<IRedBlackTreeNode<K, V>>

    setVal(val: V): void;
    setLeft(left: Nullable<IRedBlackTreeNode<K, V>>): void;
    setRight(right: Nullable<IRedBlackTreeNode<K, V>>): void;

    getSize(): number;
    setSize(size: number): void;
}