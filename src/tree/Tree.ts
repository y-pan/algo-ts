import {ITree} from "./types/ITree";
import {ITreeNode} from "./types/ITreeNode";
import {isNull} from "../utils/util";
import {TreeNode} from "./TreeNode";

export class Tree<K, V> implements ITree<K, V> {
    protected root: ITreeNode<K, V> | undefined;

    constructor() {
    }

    contains(key: K): boolean {
        Tree.validateKey(key);
        return !isNull(this.getNode(key));
    }

    getNode(key: K): ITreeNode<K, V> | undefined {
        Tree.validateKey(key);
        let cur: ITreeNode<K, V> | undefined = this.root;
        while (cur) {
            if (key === cur.getKey()) return cur;
            if (key < cur.getKey()) cur = cur.getLeft();
            else cur = cur.getRight();
        }
        return undefined;
    }

    protected getNodeFrom(node: ITreeNode<K, V>, key: K): ITreeNode<K, V> | undefined {
        return undefined;
    }

    getRoot(): ITreeNode<K, V> | undefined {
        return this.root;
    }

    getSize(): number {
        return this.root ? this.root.getSize() : 0; // Assume each nodes size property get updated in every node operation: put/delete
    }

    getValue(key: K): V | undefined {
        const node = this.getNode(key);
        return node ? node.getVal() : undefined;
    }

    isEmpty(): boolean {
        return !this.root;
    }

    put(key: K, val: V): void {
        Tree.validateKey(key);
        if (isNull(val)) {
            this.delete(key);
        }

        this.root = this.putNode(this.root, key, val); // put from node
    }

    protected putNode(node: ITreeNode<K, V> | undefined, key: K, val: V): ITreeNode<K, V> {
        Tree.validateKey(key);
        if (!node) return new TreeNode(key, val);
        if (key < node.getKey()) {
            node.setLeft(this.putNode(node.getLeft(), key, val));
        } else if (key > node.getKey()) {
            node.setRight(this.putNode(node.getRight(), key, val));
        } else {
            node.setVal(val);
        }

        node.setSize(1 + Tree.getSize(node.getLeft()) + Tree.getSize(node.getRight()));
        return node;
    }

    delete(key: K): ITreeNode<K, V> {
        Tree.validateKey(key);
        throw "Not implemented";
    }

    protected static validateKey(key: any): void {
        if (isNull(key)) throw "Key is required";
    }

    protected static getSize(node: ITreeNode<any, any> | undefined): number {
        if (!node) return 0;
        return 1 + Tree.getSize(node.getLeft()) + Tree.getSize(node.getRight());
    }

}