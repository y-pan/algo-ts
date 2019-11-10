import {StringMap} from "../../types/StringMap";
import {isNull} from "../../utils/util";
import {RedBlackTreeNode} from "../RedBlackTreeNode";
import {nlb} from "../../types/Nullable";

const KEY_COUNTER: StringMap<number> = {};

export function bstHeight(tSize: number): number { // For perfect binary tree.  E.g: when only root, then height = 0; when has 2 levels, then height is 1;
    return Math.ceil(Math.log2(tSize + 1) - 1);
}

export function bstSize(tHeight: number): number { // For fullsize, perfect binary tree
    return 2 ** (tHeight + 1) - 1;
}

export function bstWidth(tSize: number, fullWidth: boolean = true): number {
    return fullWidth ? (2 ** bstHeight(tSize)) : ((tSize + 1) / 2);
}

export function uniqueId(prefix: string | number = "default"): string {
    prefix = isNull(prefix) ? "default" : String(prefix);
    const count: number = (KEY_COUNTER[prefix] || 0) + 1;
    const key: string = `${prefix}-${count}`;
    KEY_COUNTER[prefix] = count;
    return key;
}

export function isRed(rbNode: nlb<RedBlackTreeNode<any, any>>): boolean {
    return rbNode ? rbNode.isRed() : false;
}

export function isBlack(rbNode: nlb<RedBlackTreeNode<any, any>>): boolean {
    return !isRed(rbNode);
}

export function hasRedLeft(rbNode: nlb<RedBlackTreeNode<any, any>>): boolean {
    // has a left red child
    if (!rbNode) return false;
    return rbNode.left ? rbNode.left.isRed() : false;
}

export function hasRedLeftLeft(rbNode: nlb<RedBlackTreeNode<any, any>>): boolean {
    // has left red child which also has a left red child
    if (!rbNode) return false;
    return hasRedLeft(rbNode) && hasRedLeft(rbNode.left);
}

export function size(h: nlb<RedBlackTreeNode<any, any>>): number {
    return !h ? 0 : h.size;
}
