import {ITreeNode} from "./ITreeNode";
import {Nullable} from "../../types/Nullable";

export interface ITree<K, V, N extends ITreeNode<K, V>> {
    getRoot(): Nullable<N>;
    getSize(): number;
    isEmpty(): boolean;

    put(key: K, val: V): void;
    // putNode(node: ITreeNode<K, V>, key: K, val: V): ITreeNode<K, V>;

    getValue(key: K): Nullable<V>;
    contains(key: K): boolean;

    // getNodeFrom(node: ITreeNode<K, V>, key: K): ITreeNode<K, V> | undefined;
    getNode(key: K): Nullable<N>; // for tree visualization processing routine

    //TODO:
    rank?(): number;
    floor?(): number;
    ceiling?(): number;
    delete(key: K): Nullable<N>;
    deleteMin?(): void;
    deleteMax?(): void;
}