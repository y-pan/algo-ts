import {IRedBlackTree} from "./types/IRedBlackTree";
import {RedBlackTreeNode} from "./RedBlackTreeNode";
import {nlb} from "../types/Nullable";
import {hasRedLeft, hasRedLeftLeft, isBlack, isRed, size} from "./util/TreeUtil";
import {requireNonNull, requireTrue} from "../utils/Type";

/*
From Java source:
https://github.com/kevin-wayne/algs4/blob/master/src/main/java/edu/princeton/cs/algs4/RedBlackBST.java
 */

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
        requireNonNull(key, "getValue() requires: key non-null");
        const node = this.getNode(key);
        return node ? node.value : undefined;
    }

    contains(key: K): boolean {
        requireNonNull(key, "contains() requires: key non-null");
        return this.getNode(key) != null;
    }

    getNode(key: K): Node<K, V> {
        requireNonNull(key, "getNode() requires: key non-null");
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
        //TODO: balance after deletion

        console.log("TO delete()", key)
        if (key == null) throw `argument to delete() is null`;
        if (!this._root || !this.contains(key)) return undefined;
        // console.warn("no delete: ", key)
        // return undefined;
        const bin: RedBlackTreeNode<K, V>[] = [];

        if (isBlack(this._root.left) && isBlack(this._root.right)) {
            this._root.markRed();
        }
        this._root = this.deleteFrom(this._root, key, bin);

        console.log("deleted(): ", bin[0] ? bin[0].key : null, bin);
        this._root && this._root.markBlack();

        return bin.length > 0 ? bin[0] : null;
    }

    put(key: K, value: V): void {
        requireNonNull(key, "put() requires: key non-null");
        requireNonNull(value, "put() requires: value non-null");

        // if (val == null) {
        //     console.warn(`By design to delete node [key=${key}] when value is null`);
        //     this.delete(key);
        //     return;
        // }

        this._root = this.putNode(this._root, key, value); // put from node
        this._root && this._root.markBlack();
    }

    protected putNode(h: Node<K, V>, key: K, val: V): Node<K, V> {
        requireNonNull(key, "putNode() requires: node non-null");
        requireNonNull(key, "putNode() requires: val non-null");

        if (!h) return new RedBlackTreeNode(key, val);
        if (key < h.key) {
            h.left = this.putNode(h.left, key, val);
        } else if (key > h.key) {
            h.right = this.putNode(h.right, key, val);
        } else {
            h.value = val;
        }

        return this.balance(h);
    }

    rotateRight(h: RedBlackTreeNode<K, V>): RedBlackTreeNode<K, V> {
        h = requireNonNull(h, "rotateRight() requires: h non-null");

        const x = requireNonNull(h.left, "rotateRight() requires: h.left non-null");
        requireTrue(isRed(h.left), "rotateRight() requires: h.left is red");
        requireTrue(isRed(requireNonNull(h.left).left), "rotateRight() requires: h.left.left is red")

        h.left = x.right;
        x.right = h;
        x.color = x.right.color;
        x.right.markRed();

        x.size = h.size;
        h.size = 1 + size(h.left) + size(h.right);
        return x;
    }

    rotateLeft(h: RedBlackTreeNode<K, V>): RedBlackTreeNode<K, V> {
        h = requireNonNull(h, "rotateLeft() requires: h non-null");
        const x = requireNonNull(h.right, "rotateLeft() requires: h.right non-null");

        requireTrue(isBlack(h.left), "rotateLeft() requires: h.left is black");
        requireTrue(isRed(h.right), "rotateLeft() requires: h.right is red");

        h.right = x.left;
        x.left = h;
        x.color = x.left.color;
        x.left.markRed();

        x.size = h.size;
        h.size = 1 + size(h.left) + size(h.right);
        return x;
    }

    flipColors(h: RedBlackTreeNode<K, V>): RedBlackTreeNode<K, V> {
        requireNonNull(h, "flipColors() requires: h non-null");
        const hLeft = requireNonNull(h.left, "flipColors() requires: h.left non-null");
        const hRight = requireNonNull(h.right, "flipColors() requires: h.right non-null");
        requireTrue(isRed(h.left), "flipColors() requires: h.left red");
        requireTrue(isRed(h.right), "flipColors() requires: h.right red");

        hLeft.color = !hLeft.color;
        hRight.color = !hRight.color;
        h.color = !h.color;
        return h;
    }

    deleteMin(): Node<K, V> {
        if (!this._root) throw `Tree underflow.`;
        const bin: Node<K, V>[] = [];

        if (!isRed(this._root.left) && !isRed(this._root.right)) {
            this._root.markRed();
        }

        this._root = this.deleteMinFrom(this._root, bin);
        this._root && this._root.markBlack();

        // this.check();
        return bin.length > 0 ? bin[0] : null;
    }

    private deleteMinFrom(h: Node<K, V>, bin: Node<K, V>[]): Node<K, V> {
        h = requireNonNull(h, "deleteMinFrom() requires: h non-null");

        if (!h.left) { // no left, then current node h is of the minimum key
            bin.push(h.copy());
            return h.right; // TODO: null ?
        }

        if (!isRed(h.left) && !isRed(h.left.left)) {
            // TODO: some issue here
            // h = this.moveRedLeft(h);
        }

        h.left = this.deleteMinFrom(h.left, bin);
        return this.balance(h);
    }

    deleteMax(): Node<K, V> {
        if (!this._root) throw `Tree underflow.`;
        const bin: Node<K, V>[] = [];

        if (!isRed(this._root.left) && !isRed(this._root.right)) {
            this._root.markRed();
        }

        this._root = this.deleteMaxFrom(this._root, bin);
        this._root && this._root.markBlack();

        // this.check();
        return bin.length > 0 ? bin[0] : null;
    }

    private deleteMaxFrom(h: Node<K, V>, bin: Node<K, V>[]): Node<K, V> {
        h = requireNonNull(h, "deleteMaxFrom() requires: h non-null");

        if (!h.right) {// no right, then current node h is of the maximum key
            bin.push(h.copy());
            return h.left; // TODO: null ?
        }

        if (!isRed(h.right) && !isRed(h.right.left)) {
            // TODO: some issue here
            // h = this.moveRedRight(h);
        }

        h.right = this.deleteMaxFrom(h.right, bin);
        return this.balance(h);
    }

    // checks
    private check(): void {
        if (!this.isBST()) console.error("No in symmetric order");
        if (!this.isSizeConsistent()) console.error("Subtree counts not consistent");
        if (!this.isRankConsistent()) console.error("Ranks not consistent");
        if (!this.is23()) console.error("Not a 2-3 tree");
        if (!this.isBalanced()) console.error(("Not balanced"));
    }

    private isBST(): boolean {
        return this.isBSTFrom(this._root, null, null);
    }

    private isBSTFrom(node: nlb<Node<K, V>>, min: nlb<K>, max: nlb<K>): boolean {
        if (!node) return true;
        if (min != null && min >= node.key) return false;
        if (max != null && max <= node.key) return false;

        return this.isBSTFrom(node.left, min, node.key) && this.isBSTFrom(node.right, node.key, max);
    }

    select(rank: number): nlb<K> {
        if (!this._root) return undefined;
        if (rank < 0 || rank >= this.getSize()) throw `argument to select() is invalid: ${rank}`;
        let x = this.selectFrom(this._root, rank);
        return x.key;
    }

    private selectFrom(x: Node<K, V>, rank: number): RedBlackTreeNode<K, V> {
        if (!x) throw `Node should not be null in selectFrom()`;
        let t = size(x.left);
        if (t > rank) return this.selectFrom(x.left, rank);
        else if (t < rank) return this.selectFrom(x.right, rank - t - 1);
        else return x;
    }

    /* the num of keys which < k*/
    rank(key: nlb<K>): number {
        if (key == null) throw `Argument to rank() is null`;
        return this.rankFrom(key, this._root);
    }

    private rankFrom(key: K, x: Node<K, V>): number {
        if (!x) return 0;
        if (key < x.key) return this.rankFrom(key, x.left);
        else if (key > x.key) return 1 + size(x.left) + this.rankFrom(key, x.right);
        else return size(x.left);
    }

    private isSizeConsistent(): boolean {
        return this.isSizeConsistentFrom(this._root);
    }

    private isRankConsistent() {
        for (let i = 0; i < this.getSize(); i++) {
            if (i != this.rank(this.select(i))) return false;
        }
        for (let key of this.keys()) {
            if (key != this.select(this.rank(key))) return false;
        }
        return true;
    }

    keys(): K[] {
        if (this.isEmpty()) return [];
        return this.keysBetween(this.minKey(), this.maxKey());
    }

    private keysBetween(lo: nlb<K>, hi: nlb<K>): K[] {
        console.warn("Not implemented");
        return []; // TODO: ...
    }

    minKey(): nlb<K> {
        if (!this._root) return undefined;
        return this.minNodeFrom(this._root).key;
    }

    maxKey(): nlb<K> {
        if (!this._root) return undefined;
        return this.maxNodeFrom(this._root).key;
    }

    private maxNodeFrom(node: RedBlackTreeNode<K, V>): RedBlackTreeNode<K, V> {
        if (!node.right) return node;
        return this.maxNodeFrom(node.right);
    }

    private minNodeFrom(node: RedBlackTreeNode<K, V>): RedBlackTreeNode<K, V> {
        if (!node.left) return node;
        return this.minNodeFrom(node.left);
    }

    private is23() {
        return this.is23From(this._root);
    }

    private isBalanced() {
        let black = 0;
        let x: Node<K, V> = this._root;
        while (x != null) {
            if (isBlack(x)) black++;
            x = x.left;
        }
        return this.isBalancedFrom(this._root, black);
    }

    private is23From(node: Node<K, V>): boolean {
        if (!node) return true;
        if (isRed(node.right)) return false;
        if (node != this._root && isRed(node) && isRed(node.left)) return false;
        return this.is23From(node.left) && this.is23From(node.right);
    }

    private isSizeConsistentFrom(node: Node<K, V>): boolean {
        if (!node) return true;
        if (node.size != (size(node.left) + size(node.right) + 1)) return false;
        return this.isSizeConsistentFrom(node.left) && this.isSizeConsistentFrom(node.right);
    }

    private isBalancedFrom(x: Node<K, V>, black: number): boolean {
        if (!x) return black === 0;
        if (isBlack(x)) black--;
        return this.isBalancedFrom(x.left, black) && this.isBalancedFrom(x.right, black);
    }

    private deleteFrom(h: RedBlackTreeNode<K, V>, key: K, bin: RedBlackTreeNode<K, V>[]): Node<K, V> {
        if (key < h.key) {// go left
            if (!hasRedLeftLeft(h)) {
                h = this.moveRedLeft(h);
            }
            if (!h.left) {
                console.warn("h.left should not be null");
            } else {
                h.left = this.deleteFrom(h.left, key, bin);
            }
        } else { // go right
            if (isRed(h.left)) h = this.rotateRight(h);

            if (key == h.key && h.right == null) {
                // delete and no need to balance
                bin.push(h.copy());
                return null;
            }

            // move then delete... complicated
            if (isBlack(h.right) && !hasRedLeft(h.right)) h = this.moveRedRight(h);

            if (!h.right) throw `Unexpected null`;

            if (key == h.key) {
                bin.push(h.copy());

                let node = this.minNodeFrom(h.right);
                h.key = node.key;
                h.value = node.value;
                h.right = this.deleteMinFrom(h.right, []); // This doesn't matter
            } else {
                h.right = this.deleteFrom(h.right, key, bin);
            }
        }
        // got it
        h.size = 1 + size(h.left) + size(h.right);
        return this.balance(h);
    }

    // Assuming that h is red and both h.left and h.left.left
    // are black, make h.left or one of its children red.
    private moveRedLeft(h: RedBlackTreeNode<K, V>): RedBlackTreeNode<K, V> {
        h = requireNonNull(h, "moveRedLeft() requires: h non-null");
        const hLeft = requireNonNull(h.left, "moveRedLeft() requires: h.left non-null");
        const hRight = requireNonNull(h.right, "moveRedLeft() requires: h.right non-null");

        requireTrue(isRed(h), "moveRedLeft() requires: h is red");
        requireTrue(isBlack(h.left), "moveRedLeft() requires: h.left is black");
        requireTrue(isBlack(hLeft.left), "moveRedLeft() requires: h.left.left is black");

        this.flipColors(h);
        if (isRed(hRight.left)) {
            h.right = this.rotateRight(hRight);
            h = this.rotateLeft(h);
            this.flipColors(h);
        }
        return h;
    }

    // Assuming that h is red and both h.right and h.right.left
    // are black, make h.right or one of its children red.
    private moveRedRight(h: RedBlackTreeNode<K, V>): RedBlackTreeNode<K, V> {
        h = requireNonNull(h, "moveRedRight() requires: h non-null");
        const hLeft = requireNonNull(h.left, "moveRedRight() requires: h.left non-null");
        const hRight = requireNonNull(h.right, "moveRedRight() requires: h.right non-null");
        requireTrue(isRed(h), "moveRedRight() requires: h is red");
        requireTrue(isBlack(hRight.left), "moveRedRight() requires: h.right.left is black");

        this.flipColors(h);
        if (isRed(hLeft.left)) {
            h = this.rotateRight(h);
            this.flipColors(h);
        }
        return h;
    }

    private balance(h: RedBlackTreeNode<K, V>): Node<K, V> {
        h = requireNonNull(h, "balance() requires: h non-null");

        if (isBlack(h.left) && isRed(h.right)) h = this.rotateLeft(h);
        if (h.left && isRed(h.left) && isRed(h.left.left)) h = this.rotateRight(h);
        if (isRed(h.left) && isRed(h.right)) this.flipColors(h);

        h.size = size(h.left) + size(h.right) + 1;
        return h;
    }
}