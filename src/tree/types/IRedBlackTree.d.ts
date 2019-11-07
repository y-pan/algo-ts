import {ITree} from "./ITree";
import {RedBlackTreeNode} from "../RedBlackTreeNode";

export interface IRedBlackTree<K, V> extends ITree<K, V, RedBlackTreeNode<K, V>> {
    rotateLeft(node: RedBlackTreeNode<K, V>): RedBlackTreeNode<K, V>;

    rotateRight(node: RedBlackTreeNode<K, V>): RedBlackTreeNode<K, V>;

    flipColors(node: RedBlackTreeNode<K, V>): RedBlackTreeNode<K, V>;
}