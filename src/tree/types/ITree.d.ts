import {ITreeNode} from "./ITreeNode";

export interface ITree<K, V> {
    getRoot(): ITreeNode<K, V> | undefined;
    getSize(): number;
    isEmpty(): boolean;

    put(key: K, val: V): void;
    // putNode(node: ITreeNode<K, V>, key: K, val: V): ITreeNode<K, V>;

    delete(key: K): ITreeNode<K, V>;
    getValue(key: K): V | undefined;
    contains(key: K): boolean;

    // getNodeFrom(node: ITreeNode<K, V>, key: K): ITreeNode<K, V> | undefined;
    getNode(key: K): ITreeNode<K, V> | undefined; // for tree visualization processing routine

}