import {IRedBlackTreeNode} from "./types/IRedBlackTreeNode";
import {TreeNode} from "./TreeNode";
import {isNull} from "../utils/util";

export class RedBlackTreeNode<K, V> extends TreeNode<K, V> implements IRedBlackTreeNode<K, V> {

    protected red: boolean = true;

    constructor(key: K, val: V, red: boolean, size: number) {
        super(key, val);
        this.red = red;
    }

    isRed(): boolean {
        return this.red;
    }

    setRed(isRed: boolean): void {
        this.red = isRed;
    }

    static isRed(node: IRedBlackTreeNode<any, any>): boolean {
        return node && node.isRed();
    }
}