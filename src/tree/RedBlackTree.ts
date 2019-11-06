import {IRedBlackTree} from "./types/IRedBlackTree";
import {IRedBlackTreeNode} from "./types/IRedBlackTreeNode";
import {isNull} from "../utils/util";
import {RedBlackTreeNode} from "./RedBlackTreeNode";
import {Nullable} from "../types/Nullable";

type Node<K, V> = Nullable<IRedBlackTreeNode<K, V>>;

export class RedBlackTree<K, V> implements IRedBlackTree<K, V> {
    protected root: Node<K, V>;

    getRoot(): Node<K, V> {
        return this.root;
    }

    getSize(): number {
        return this.root ? this.root.getSize() : 0;
    }

    isEmpty(): boolean {
        return isNull(this.root);
    }

    getValue(key: K): Nullable<V> {
        this.validateKey(key);
        const node = this.getNode(key);
        return node ? node.getVal() : undefined;
    }

    contains(key: K): boolean {
        this.validateKey(key);
        const node = this.getNode(key);
        return node ? true : false;
    }

    getNode(key: K): Node<K, V> {
        this.validateKey(key);
        let node = this.root;
        while (node) {
            if (key === node.getKey()) {
                return node;
            } else if (key < node.getKey()) {
                node = node.getLeft();
            } else {
                node = node.getRight();
            }
        }
        return undefined;
    }

    delete(key: K): Nullable<IRedBlackTreeNode<K, V>> {
        throw new Error("Method not implemented.");
    }

    put(key: K, val: V): void {
        this.validateKey(key);

        if (isNull(val)) {
            console.log("null key and do delete ");
            this.delete(key);
            return;
        }

        this.root = this.putNode(this.root, key, val); // put from node
        this.root && this.root.setRed(false);
    }

    protected putNode(node: Node<K, V>, key: K, val: V): Node<K, V> {
        this.validateKey(key);
        console.log("putNode: ", node, key);
        if (!node) return new RedBlackTreeNode(key, val);
        if (key < node.getKey()) {
            node.setLeft(this.putNode(node.getLeft(), key, val));
        } else if (key > node.getKey()) {
            node.setRight(this.putNode(node.getRight(), key, val));
        } else {
            node.setVal(val);
        }

        if (RedBlackTreeNode.isBlack(node.getLeft()) &&
            RedBlackTreeNode.isRed(node.getRight())) {
            node = this.rotateLeft(node);
        }

        if (node.getLeft() && RedBlackTreeNode.isRed(node.getLeft()) && RedBlackTreeNode.isLeftRed(node.getLeft())) {
            node = this.rotateRight(node);
        }

        if (RedBlackTreeNode.isRed(node.getLeft()) && RedBlackTreeNode.isRed(node.getRight())) {
            this.flipColors(node);
        }

        node.setSize(1 + this.sizeOf(node.getLeft()) + this.sizeOf(node.getRight()));
        return node;
    }

    private sizeOf(node: Node<K, V>): number {
        return !node ? 0 : node.getSize();
    }

    rotateRight(node: IRedBlackTreeNode<K, V>): IRedBlackTreeNode<K, V> {
        console.info("rotateRight", node);

        if (!node) throw "Node is required";

        const x = node.getLeft();
        const leftLeft = x ? x.getLeft() : undefined;

        if (RedBlackTreeNode.isBlack(x)) throw "rotateRight: left child is expected to be red";
        if (!x || RedBlackTreeNode.isBlack(leftLeft)) throw "rotateRight: left child's left is expected to be red";

        node.setLeft(x.getRight());
        x && x.setRight(node);

        x.setRed(node.isRed());
        node.setRed(true);

        x.setSize(node.getSize());


        node.setSize(1 + this.sizeOf(node.getLeft()) + this.sizeOf(node.getRight()));
        return x;
    }

    rotateLeft(node: IRedBlackTreeNode<K, V>): IRedBlackTreeNode<K, V> {
        console.info("rotateLeft", node);
        if (!node) throw "Node is required";

        const x = node.getRight();

        if (RedBlackTreeNode.isRed(node.getLeft())) throw "rotateLeft: left child is expected to be black";
        if (!x || RedBlackTreeNode.isBlack(node.getRight())) throw "rotateLeft: right child is expected to be red";

        node && x && node.setRight(x.getLeft());
        x && x.setLeft(node);

        x && x.setRed(node.isRed());
        node.setRed(true);

        x && x.setSize(node.getSize());
        node.setSize(1 + this.sizeOf(node.getLeft()) + this.sizeOf(node.getRight()));
        return x;
    }

    flipColors(node: IRedBlackTreeNode<K, V>): IRedBlackTreeNode<K, V> {
        console.info("flipColors", node);

        if (!node) throw "Node is required";
        if (RedBlackTreeNode.isBlack(node)) throw "flip colors: node is expected to be black";

        const left = node.getLeft();
        const right = node.getRight();

        if (RedBlackTreeNode.isBlack(left) || RedBlackTreeNode.isBlack(right)) throw "flip colors: both children are expected to be red";

        left && left.setRed(false);
        right && right.setRed(false);
        node.setRed(true);
        return node;
    }

    private validateKey(key: K) {
        if (isNull(key)) throw `Key is required`;
    }
}