import {ITreeNode} from "../types/ITreeNode";
import {Nullable} from "../../types/Nullable";
import {ITree} from "../types/ITree";

export class TreeLevelScan<K, V, N extends ITreeNode<K, V>> {
    private readonly rootNote: Nullable<N>;
    private readonly levels: Nullable<N>[][];

    constructor(tree: ITree<K, V, N>) {
        if (!tree) throw "Tree is required";
        this.rootNote = tree.getRoot();
        this.levels = []; // all levels of nodes
        const currentLevel: Nullable<N>[] = [];// first level has the root node only

        if (this.rootNote) {
            currentLevel.push(this.rootNote);
            this.levels.push(currentLevel);
            this.scan(currentLevel);
        }
    }

    private scan(level: Nullable<N>[]): void {
        const nextLevel: Nullable<N>[] = [];
        level.forEach(node => {
            if (!node) {
                nextLevel.push(undefined, undefined); // we need to use "undefined" as placeholder to reserve the position even though they could be empty/null
            } else {
                // @ts-ignore
                nextLevel.push(node.getLeft(), node.getRight());
            }
        });

        const hasNode: boolean = Boolean(nextLevel.find(node => node));
        if (hasNode) {
            this.levels.push(nextLevel);
            this.scan(nextLevel);
        }
    }

    getFlatNodeArray(): Nullable<N>[] {
        const nodes: Nullable<N>[] = [];
        this.levels.forEach(nodeArray => {
            nodeArray.forEach(node => nodes.push(node));
        });
        return nodes;
    }

    getFlatKeyArray(): Nullable<K>[] {
        return this.getFlatNodeArray().map(node => node ? node.getKey() : undefined);
    }
}