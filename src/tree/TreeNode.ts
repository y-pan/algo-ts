import {ITreeNode} from "./types/ITreeNode";

export class TreeNode<K, V> implements ITreeNode<K, V> {
    private readonly key: K;
    protected val: V;
    protected left: ITreeNode<K, V> | undefined;
    protected right: ITreeNode<K, V> | undefined;

    protected size: number = 0;
    constructor(key: K, val: V) {
        this.key = key;
        this.val = val;
        this.size = 1;
    }

    getKey(): K {
        return this.key;
    }

    getLeft(): ITreeNode<K, V> | undefined {
        return this.left;
    }

    getRight(): ITreeNode<K, V> | undefined {
        return this.right;
    }

    getVal(): V {
        return this.val;
    }

    setVal(val: V): void {
        this.val = val;
    }

    setLeft(left: ITreeNode<K, V>): void {
        this.left = left;
    }

    setRight(right: ITreeNode<K, V>): void {
        this.right = right;
    }

    getSize(): number {
        return this.size;
    }

    setSize(size: number): void {
        this.size = size
    }

}