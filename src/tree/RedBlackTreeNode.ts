import {nlb} from "../types/Nullable";
import {TreeNode} from "./TreeNode";

type Node<K, V> = nlb<RedBlackTreeNode<K, V>>;

export class RedBlackTreeNode<K, V> extends TreeNode<K, V> {
    private static readonly RED = true;
    private static readonly BLACK = false;
    protected _color: boolean;
    protected _left: Node<K, V>;
    protected _right: Node<K, V>;

    constructor(key: K, val: V, size: number = 1) {
        super(key, val, size);
        this._color = RedBlackTreeNode.RED;
    }

    get left(): Node<K, V> {
        return this._left;
    }

    get right(): Node<K, V> {
        return this._right;
    }

    set left(left: Node<K, V>) {
        this._left = left;
    }

    set right(right: Node<K, V>) {
        this._right = right;
    }

    get color(): boolean {
        return this._color;
    }

    set color(color: boolean) {
        this._color = color;
    }

    isRed(): boolean {
        return this._color === RedBlackTreeNode.RED;
    }

    markRed(): void {
        this._color = RedBlackTreeNode.RED;
    }

    markBlack(): void {
        this._color = RedBlackTreeNode.BLACK;
    }

    static isRed(node: nlb<RedBlackTreeNode<any, any>>): boolean {
        return node ? node.color === RedBlackTreeNode.RED : false
    }

    static isBlack(node: nlb<RedBlackTreeNode<any, any>>): boolean {
        return !RedBlackTreeNode.isRed(node);
    }
}