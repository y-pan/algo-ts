import {IRedBlackTree} from "./types/IRedBlackTree";
import {RedBlackTreeNode} from "./RedBlackTreeNode";
import {nlb} from "../types/Nullable";

type Node<K, V> = nlb<RedBlackTreeNode<K, V>>;

export class RedBlackTree<K, V> implements IRedBlackTree<K, V> {
    protected _root: Node<K, V>;

    getRoot(): Node<K, V> {
        return this._root;
    }

    getSize(): number {
        return this._root ? this._root.size : 0;
    }

    isEmpty(): boolean {
        return this._root == undefined;
    }

    getValue(key: K): nlb<V> {
        this.validateKey(key);
        const node = this.getNode(key);
        return node ? node.value : undefined;
    }

    contains(key: K): boolean {
        this.validateKey(key);
        return this.getNode(key) != null;
    }

    getNode(key: K): Node<K, V> {
        this.validateKey(key);
        let node = this._root;
        while (node) {
            if (key === node.key) {
                return node;
            } else if (key < node.key) {
                node = node.left;
            } else {
                node = node.right;
            }
        }
        return undefined;
    }

    delete(key: K): nlb<RedBlackTreeNode<K, V>> {
        console.log("Method not implemented.");
        return null;
    }

    put(key: K, val: V): void {
        this.validateKey(key);

        if (val == undefined) {
            console.log("null key and do delete ");
            this.delete(key);
            return;
        }

        this._root = this.putNode(this._root, key, val); // put from node
        this._root && this._root.markBlack();
    }

    protected putNode(node: Node<K, V>, key: K, val: V): Node<K, V> {
        this.validateKey(key);
        if (!node) return new RedBlackTreeNode(key, val);
        if (key < node.key) {
            node.left = this.putNode(node.left, key, val);
        } else if (key > node.key) {
            node.right = this.putNode(node.right, key, val);
        } else {
            node.value = val;
        }

        if (RedBlackTreeNode.isBlack(node.left) &&
            RedBlackTreeNode.isRed(node.right)) {
            node = this.rotateLeft(node);
        }

        if (node.left && node.left.isRed()
            && node.left.left && node.left.left.isRed()) {
            node = this.rotateRight(node);
        }

        if (node.left && node.left.isRed()
            && node.right && node.right.isRed()) {
            this.flipColors(node);
        }

        node.size = (1 + this.sizeOf(node.left) + this.sizeOf(node.right));
        return node;
    }

    private sizeOf(node: Node<K, V>): number {
        return !node ? 0 : node.size;
    }

    rotateRight(node: RedBlackTreeNode<K, V>): RedBlackTreeNode<K, V> {
        console.info("rotateRight", node);

        if (!node) throw "Node is required";

        const x = node.left;
        const leftLeft = x ? x.left : undefined;

        if (RedBlackTreeNode.isBlack(x)) throw "rotateRight: _left child is expected to be _color";
        if (!x || RedBlackTreeNode.isBlack(leftLeft)) throw "rotateRight: _left child's _left is expected to be _color";

        node.left = x.right;
        x.right = node;

        x.color = node.color;
        node.markRed();

        x.size = node.size;
        node.size = 1 + this.sizeOf(node.left) + this.sizeOf(node.right);
        return x;
    }

    rotateLeft(node: RedBlackTreeNode<K, V>): RedBlackTreeNode<K, V> {
        console.info("rotateLeft", node);
        if (!node) throw "Node is required";

        const x = node.right;

        if (RedBlackTreeNode.isRed(node.left)) throw "rotateLeft: _left child is expected to be black";
        if (!x || RedBlackTreeNode.isBlack(node.right)) throw "rotateLeft: _right child is expected to be _color";

        node.right = x.left;
        x.left = node;

        x.color = node.color;
        node.markRed();

        x.size = node.size;
        node.size = 1 + this.sizeOf(node.left) + this.sizeOf(node.right);
        return x;
    }

    flipColors(node: RedBlackTreeNode<K, V>): RedBlackTreeNode<K, V> {
        console.info("flipColors", node);

        if (!node) throw "Node is required";
        // if (RedBlackTreeNode.isBlack(node)) throw "flip colors: node is expected to be black";

        const left = node.left;
        const right = node.right;

        // if (RedBlackTreeNode.isBlack(_left) || RedBlackTreeNode.isBlack(_right)) throw "flip colors: both children are expected to be _color";

        left && (left.color = !left.color);
        right && (right.color = !right.color);
        node.color = !node.color;
        return node;
    }

    private validateKey(key: K) {
        if (key == null) throw `Key is required`;
    }
}