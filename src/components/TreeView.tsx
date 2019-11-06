import React from "react";
import {uniqueId} from "../tree/util/TreeUtil";
import {Nullable} from "../types/Nullable";
import {TreeVis} from "../tree/vis/TreeVis";
import {TreeLevelScan} from "../tree/processors/TreeLevelScan";
import {RedBlackTree} from "../tree/RedBlackTree";
import {IRedBlackTreeNode} from "../tree/types/IRedBlackTreeNode";
import {ArrayVis} from "../linear/ArrayVis";

interface TreeProps {

}

interface TreeState {

}

export class TreeView extends React.Component<TreeProps, TreeState> {
    // private readonly alphaTree = new RedBlackTree<string, string>();
    private readonly redBlackTree = new RedBlackTree<number, string>();

    // private alphaTreeSvgContainer: Nullable<HTMLElement> = null;
    private redBlackTreeSvgContainer: Nullable<HTMLElement>;

    // private alphaTreeVis: TreeVis<string> = new TreeVis();
    private redBlackTreeVis: TreeVis<IRedBlackTreeNode<number, string>, number, string> = new TreeVis();
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

        // const alphaSvgContainer = (
            {/*<div id={"alpha-tree-svg-container"}*/}
                 // ref={ref => this.alphaTreeSvgContainer = ref}>
            // </div>
        // );

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
                {/*{alphaSvgContainer}*/}
                {redBlackSvgContainer}
            </div>
        );
    }

    private addRandom(): void {
        const key: number = Math.floor(Math.random() * 100);
        const value: string = uniqueId(key);
        console.log("AddRandom: ", key, value);
        this.array.push(key);
        this.redBlackTree.put(key, value);
        console.log("tree size: ", this.redBlackTree.getSize())
        // const alphaKey: string = getRandomAlpha();
        // const alphaValue: string = uniqueId(alphaKey);
        // this.alphaTree.put(alphaKey, alphaValue);
        //
        // this.renderAlphaSvg();
        this.renderArraySvg();
        this.renderRedBlackSvg();
    }
    //
    // private renderAlphaSvg(): void {
    //     if (this.alphaTreeSvgContainer) {
    //         this.alphaTreeVis
    //             .withNodeSize(10)
    //             .withContainer(this.alphaTreeSvgContainer)
    //             .withData(new TreeLevelScan(this.alphaTree).getFlatKeyArray()).draw();
    //     }
    // }

    private renderRedBlackSvg(): void {
        if (this.redBlackTreeSvgContainer) {
            let levels = new TreeLevelScan(this.redBlackTree);
            // let nodes: Nullable<IRedBlackTreeNode<number, string>>[] = levels.getFlatNodeArray() as Nullable<IRedBlackTreeNode<number, string>>[];

            // let colors: string[] = nodes.map(node => {
            //     if (!node) return "#cccccc";
            //     if (node && node.isRed()) return "#ff8392";
            //     return "#7a7a7a";
            // });
            // console.log("colors", colors);
            this.redBlackTreeVis
                .withNodeSize(10)
                .withContainer(this.redBlackTreeSvgContainer)
                .withData(levels.getFlatNodeArray())
                .withKeyExtractor((node: Nullable<IRedBlackTreeNode<number, string>>) => {
                    return node == null ? undefined : node.getKey();
                })
                .withValueExtractor((node: Nullable<IRedBlackTreeNode<number, string>>) => {
                    return node == null ? "" : node.getVal();
                })
                .withNodeColorProvider((node: Nullable<IRedBlackTreeNode<number, string>>, i: number) => {
                   if (node == null) {
                       return "#ffffff";
                   } else if (node.isRed()) {
                       return "#ff0207";
                   } else {
                       return "#2b272b";
                   }
                }).draw();
        }
    }

    private renderArraySvg(): void {
        if (!this.arraySvgContainer) {
            return undefined;
        }
        this.arrayVis.withContainer(() => this.arraySvgContainer)
            .withData(this.array)
            .draw();
    }
}