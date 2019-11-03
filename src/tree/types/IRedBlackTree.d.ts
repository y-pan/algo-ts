import {IRedBlackTreeNode} from "./IRedBlackTreeNode";

export interface IRedBlackTree<K, V> extends Tree<K, V> {
    rotateLeft(node: IRedBlackTreeNode<K, V>): IRedBlackTreeNode<K, V>;
    rotateRight(node: IRedBlackTreeNode<K, V>): IRedBlackTreeNode<K, V>;
    flipColor(node: IRedBlackTreeNode<K, V>): IRedBlackTreeNode<K, V>;
}