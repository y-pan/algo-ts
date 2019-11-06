import {IRedBlackTreeNode} from "./types/IRedBlackTreeNode";
import {Nullable} from "../types/Nullable";

type Node<K, V> = Nullable<IRedBlackTreeNode<K, V>>;

export class RedBlackTreeNode<K, V> implements IRedBlackTreeNode<K, V> {
    private readonly key: K;
    protected val: V;
    protected left: Node<K, V>;
    protected right: Node<K, V>;
    protected red: boolean;
    protected _size: number = 0;

    constructor(key: K, val: V) {
        this.key = key;
        this.val = val;
        this._size = 1;
        this.red = true;
    }

    isRed(): boolean {
        return this.red;
    }

    setRed(isRed: boolean): void {
        this.red = isRed;
    }

    static isRed(node: Nullable<IRedBlackTreeNode<any, any>>): boolean {
        return node ? node.isRed() : false;
    }

    static isBlack(node: Nullable<IRedBlackTreeNode<any, any>>): boolean {
        return !RedBlackTreeNode.isRed(node);
    }

    static isLeftRed(node: Nullable<IRedBlackTreeNode<any, any>>): boolean {
        return node ? RedBlackTreeNode.isRed(node.getLeft()) : false;
    }

    static isRightBlack(node: Nullable<IRedBlackTreeNode<any, any>>): boolean {
        return !node
    }

    getKey(): K {
        return this.key;
    }

    getLeft(): Node<K, V> {
        return this.left;
    }

    getRight(): Node<K, V> {
        return this.right;
    }

    getVal(): V {
        return this.val;
    }

    setVal(val: V): void {
        this.val = val;
    }

    setLeft(left: Node<K, V>): void {
        this.left = left;
    }

    setRight(right: Node<K, V>): void {
        this.right = right;
    }

    getSize(): number {
        return this._size;
    }

    setSize(size: number): void {
        this._size = size
    }

}