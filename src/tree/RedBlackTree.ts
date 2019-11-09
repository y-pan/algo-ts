import {IRedBlackTree} from "./types/IRedBlackTree";
import {RedBlackTreeNode} from "./RedBlackTreeNode";
import {nlb} from "../types/Nullable";
import {hasRedLeft, hasRedLeftLeft, isBlack, isRed} from "./util/TreeUtil";

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

        if (isBlack(node.left) &&
            isRed(node.right)) {
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
        console.info("rotateRight()", node.key);

        if (!node) throw "Node is required";

        const x = node.left;
        const leftLeft = x ? x.left : undefined;

        if (isBlack(x)) throw "rotateRight: _left child is expected to be _color";
        if (!x || isBlack(leftLeft)) throw "rotateRight: _left child's _left is expected to be _color";

        node.left = x.right;
        x.right = node;

        x.color = node.color;
        node.markRed();

        x.size = node.size;
        node.size = 1 + this.sizeOf(node.left) + this.sizeOf(node.right);
        return x;
    }

    rotateLeft(node: RedBlackTreeNode<K, V>): RedBlackTreeNode<K, V> {
        console.info("rotateLeft()", node.key);
        if (!node) throw "Node is required";

        const x = node.right;

        if (isRed(node.left)) throw "rotateLeft: _left child is expected to be black";
        if (!x || isBlack(node.right)) throw "rotateLeft: _right child is expected to be _color";

        node.right = x.left;
        x.left = node;

        x.color = node.color;
        node.markRed();

        x.size = node.size;
        node.size = 1 + this.sizeOf(node.left) + this.sizeOf(node.right);
        return x;
    }

    flipColors(node: RedBlackTreeNode<K, V>): RedBlackTreeNode<K, V> {
        console.info("flipColors()", node.key);

        if (!node) throw "Node is required";
        // if (isBlack(node)) throw "flip colors: node is expected to be black";

        const left = node.left;
        const right = node.right;

        // if (isBlack(_left) || isBlack(_right)) throw "flip colors: both children are expected to be _color";

        left && (left.color = !left.color);
        right && (right.color = !right.color);
        node.color = !node.color;
        return node;
    }

    deleteMax(): Node<K, V> {
        // TODO: balance after deletion
        if (!this._root) throw `Tree underflow.`;
        if (!isRed(this._root.left) && !isRed(this._root.right)) this._root.markRed();
        const bin: Node<K, V>[] = [];
        this._root = this.deleteMaxFrom(this._root, bin);
        this._root && this._root.markBlack();
        return bin.length > 0 ? bin[0] : null;
    }

    deleteMin(): Node<K, V> {
        //TODO: balance after deletion
        if (!this._root) throw `Tree underflow.`;
        if (!isRed(this._root.left) && !isRed(this._root.right)) this._root.markRed();
        const bin: Node<K, V>[] = [];
        this._root = this.deleteMinFrom(this._root, bin);
        this._root && this._root.markBlack();
        return bin.length > 0 ? bin[0] : null;
    }

    private deleteMinFrom(h: Node<K, V>, bin: Node<K, V>[]): Node<K, V> {
        if (!h) throw `Unexpected null argument for deleteMinFrom()`;
        if (!h.left) {
            bin.push(h.copy());
            return h.right;
        }
        // if (!isRed(h.left) && !isRed(h.left.left)) h = this.moveRedLeft(h);

        h.left = this.deleteMinFrom(h.left, bin);
        // return this.balance(h);
        return h;
    }

    private deleteMaxFrom(h: Node<K, V>, bin: Node<K, V>[]): Node<K, V> {
        if (!h) throw `Unexpected null argument for deleteMaxFrom()`;
        if (!h.right) {
            bin.push(h.copy());
            return h.left;
        }

        h.right = this.deleteMaxFrom(h.right, bin);
        // balance ?
        return h;
    }

    private validateKey(key: K) {
        if (key == null) throw `Key is required`;
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
        let t = this.sizeOf(x.left);
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
        else if (key > x.key) return 1 + this.sizeOf(x.left) + this.rankFrom(key, x.right);
        else return this.sizeOf(x.left);
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
        if (node.size != (this.sizeOf(node.left) + this.sizeOf(node.right) + 1)) return false;
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
        return this.balance(h);
    }

    private moveRedLeft(h: RedBlackTreeNode<K, V>): RedBlackTreeNode<K, V> {
        this.flipColors(h);
        if (h.right && isRed(h.right.left)) {
            h.right = this.rotateRight(h.right);
            h = this.rotateLeft(h);
            this.flipColors(h);
            ;
        }
        return h;
    }

    private moveRedRight(h: RedBlackTreeNode<K, V>): RedBlackTreeNode<K, V> {
        this.flipColors(h);
        if (h.left && isRed(h.left)) {
            h = this.rotateRight(h);
            this.flipColors(h);
        }
        return h;
    }

    private balance(h: RedBlackTreeNode<K, V>): Node<K, V> {
        if (isRed(h.right)) h = this.rotateLeft(h);
        if (h.left && isRed(h.left) && isRed(h.left.left)) h = this.rotateRight(h);
        if (isRed(h.left) && isRed(h.right)) this.flipColors(h);

        h.size = this.sizeOf(h.left) + this.sizeOf(h.right) + 1;
        return h;
    }
}