import {nlb} from "../../types/Nullable";
import {ITree} from "../types/ITree";
import {TreeNode} from "../TreeNode";
import {requireNonNull} from "../../utils/Type";

export class TreeLevelScan<K, V, N extends TreeNode<K, V>> {
    private readonly rootNote: nlb<N>;
    private readonly levels: nlb<N>[][];

    constructor(tree: ITree<K, V, N>) {
        requireNonNull(tree, "Tree is required");
        this.rootNote = tree.getRoot();
        this.levels = []; // all levels of nodes
        const currentLevel: nlb<N>[] = [];// first level has the _root node only

        if (this.rootNote) {
            currentLevel.push(this.rootNote);
            this.levels.push(currentLevel);
            this.scan(currentLevel);
        }
    }

    private scan(level: nlb<N>[]): void {
        const nextLevel: nlb<N>[] = [];
        level.forEach(node => {
            if (!node) {
                nextLevel.push(undefined, undefined); // we need to use "undefined" as placeholder to reserve the position even though they could be isParentEmpty/null
            } else {
                // @ts-ignore
                nextLevel.push(node.left, node.right);
            }
        });

        const hasNode: boolean = Boolean(nextLevel.find(node => node));
        if (hasNode) {
            this.levels.push(nextLevel);
            this.scan(nextLevel);
        }
    }

    getFlatNodeArray(): nlb<N>[] {
        const nodes: nlb<N>[] = [];
        this.levels.forEach(nodeArray => {
            nodeArray.forEach(node => nodes.push(node));
        });
        return nodes;
    }

    getFlatKeyArray(): nlb<K>[] {
        return this.getFlatNodeArray().map(node => node ? node.key : undefined);
    }
}