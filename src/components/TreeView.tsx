import React from "react";
import {uniqueId} from "../tree/util/TreeUtil";
import {Nullable} from "../types/Nullable";
import {TreeVis} from "../tree/vis/TreeVis";
import {TreeLevelScan} from "../tree/processing/TreeLevelScan";
import {RedBlackTree} from "../tree/RedBlackTree";
import {RedBlackTreeNode} from "../tree/RedBlackTreeNode";
import {ArrayVis} from "../linear/ArrayVis";

interface TreeProps {

}

interface TreeState {

}

export class TreeView extends React.Component<TreeProps, TreeState> {
    private readonly redBlackTree = new RedBlackTree<number, string>();

    private redBlackTreeSvgContainer: Nullable<HTMLElement>;

    private redBlackTreeVis: TreeVis<RedBlackTreeNode<number, string>, number, string> = new TreeVis();
    private arraySvgContainer: Nullable<HTMLElement>;
    private arrayVis: ArrayVis<number> = new ArrayVis();
    private array: Nullable<number>[] = [];

    constructor(props: TreeProps) {
        super(props);
        (window as any)["tree"] = this.redBlackTree;
        (window as any)["vis"] = this.redBlackTreeVis;

    }

    render(): JSX.Element {

        const operations = (
            <button onClick={() => this.addRandom()}>Add Random</button>
        );

        const arraySvgContainer = (
            <div id={"array-svg-container"} className={"svg-container"}
                 ref={ref => this.arraySvgContainer = ref}>
            </div>
        );

        const redBlackSvgContainer = (
            <div id={"red-black-tree-svg-container"} className={"svg-container"}
                 ref={ref => this.redBlackTreeSvgContainer = ref}>
            </div>
        );

        return (
            <div>
                {operations}
                {arraySvgContainer}
                {redBlackSvgContainer}
            </div>
        );
    }

    private addRandom(): void {
        const key: number = Math.floor(Math.random() * 100);
        const value: string = uniqueId(key);
        // console.log("AddRandom: ", key, value);
        this.array.push(key);
        this.redBlackTree.put(key, value);
        // console.log("tree size: ", this.redBlackTree.getSize());

        this.renderArraySvg();
        this.renderRedBlackSvg();
    }

    private renderRedBlackSvg(): void {
        if (this.redBlackTreeSvgContainer) {
            let levels = new TreeLevelScan(this.redBlackTree);

            this.redBlackTreeVis
                .withNodeSize(10)
                .withContainer(this.redBlackTreeSvgContainer)
                .withData(levels.getFlatNodeArray())
                .withKeyExtractor((node: Nullable<RedBlackTreeNode<number, string>>) => {
                    return node == null ? undefined : node.key;
                })
                .withValueExtractor((node: Nullable<RedBlackTreeNode<number, string>>) => {
                    return node == null ? "" : node.value;
                })
                .withNodeColorProvider((node: Nullable<RedBlackTreeNode<number, string>>, i: number) => {
                   if (!node) {
                       return "#ffffff";
                   } else if (node.isRed()) {
                       return "#ff7f84";
                   } else {
                       return "#b7b5bc";
                   }
                }).draw();
        }
    }

    private renderArraySvg(): void {
        if (this.arraySvgContainer) {
            this.arrayVis.withContainer(this.arraySvgContainer)
                .withData(this.array)
                .draw();
        }
    }
}