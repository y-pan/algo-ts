import {IRedBlackTreeNode} from "./IRedBlackTreeNode";
import {ITree} from "./ITree";

export interface IRedBlackTree<K, V> extends ITree<K, V, IRedBlackTreeNode<K, V>> {
    rotateLeft(node: IRedBlackTreeNode<K, V>): IRedBlackTreeNode<K, V>;
    rotateRight(node: IRedBlackTreeNode<K, V>): IRedBlackTreeNode<K, V>;
    flipColors(node: IRedBlackTreeNode<K, V>): IRedBlackTreeNode<K, V>;
}