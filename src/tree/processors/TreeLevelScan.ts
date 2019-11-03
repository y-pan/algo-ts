import {Tree} from "../Tree";
import {ITreeNode} from "../types/ITreeNode";
import {Nullable} from "../../types/Nullable";

export class TreeLevelScan<K, V> {
    private readonly rootNote: Nullable<ITreeNode<K, V>>;
    private readonly levels: Nullable<ITreeNode<K, V>>[][];

    constructor(tree: Tree<K, V>) {
        if (!tree) throw "TreeView is required";
        this.rootNote = tree.getRoot();
        this.levels = []; // all levels of nodes
        const currentLevel: Nullable<ITreeNode<K, V>>[] = [];// first level has the root node only

        if (this.rootNote) {
            currentLevel.push(this.rootNote);
            this.levels.push(currentLevel);
            this.scan(currentLevel);
        }
    }

    private scan(level: Nullable<ITreeNode<K, V>>[]): void {
        const nextLevel: Nullable<ITreeNode<K, V>>[] = [];
        level.forEach(node => {
            if (!node) {
                nextLevel.push(undefined, undefined); // we need to use "undefined" as placeholder to reserve the position even though they could be empty/null
            } else {
                nextLevel.push(node.getLeft(), node.getRight());
            }
        });

        const hasNode: boolean = Boolean(nextLevel.find(node => node));
        if (hasNode) {
            this.levels.push(nextLevel);
            this.scan(nextLevel);
        }
    }

    getFlatNodeArray(): Nullable<ITreeNode<K, V>>[] {
        const nodes: Nullable<ITreeNode<K, V>>[] = [];
        this.levels.forEach(nodeArray => {
            nodeArray.forEach(node => nodes.push(node));
        });
        return nodes;
    }

    getFlatKeyArray(): Nullable<K>[] {
        return this.getFlatNodeArray().map(node => node ? node.getKey() : undefined);
    }
}