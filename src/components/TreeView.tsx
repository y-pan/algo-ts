import React from "react";
import {Tree} from "../tree/Tree";
import {uniqueId} from "../tree/util/TreeUtil";
import {Nullable} from "../types/Nullable";
import {TreeVis} from "../tree/vis/TreeVis";
import {TreeLevelScan} from "../tree/processors/TreeLevelScan";
import {getRandomAlpha} from "../utils/util";

interface TreeProps {

}

interface TreeState {

}

export class TreeView extends React.Component<TreeProps, TreeState> {
    private readonly tree = new Tree<number, string>();
    private readonly alphaTree = new Tree<string, string>();

    private treeSvgContainer: Nullable<HTMLElement> = null;
    private alphaTreeSvgContainer: Nullable<HTMLElement> = null;

    private treeVis: TreeVis<number> = new TreeVis();
    private alphaTreeVis: TreeVis<string> = new TreeVis();

    constructor(props: TreeProps) {
        super(props);
    }

    render(): JSX.Element {

        const operations = (
            <button onClick={() => this.addRandom()}>Add Random</button>
        );
        const svgContainer = (
            <div id={"tree-svg-container"}
                 ref={ref => this.treeSvgContainer = ref}>

            </div>
        );

        const alphaSvgContainer = (
            <div id={"alpha-tree-svg-container"}
                 ref={ref => this.alphaTreeSvgContainer = ref}>
            </div>
        );

        return (
            <div>
                {operations}
                {svgContainer}
                {alphaSvgContainer}
            </div>
        );
    }

    private addRandom(): void {
        const key: number = Math.floor(Math.random() * 30);
        const value: string = uniqueId(key);
        this.tree.put(key, value);

        const alphaKey: string = getRandomAlpha();
        const alphaValue: string = uniqueId(alphaKey);
        this.alphaTree.put(alphaKey, alphaValue);

        this.renderSvg();
        this.renderAlphaSvg();
    }

    private renderSvg(): void {
        if (this.treeSvgContainer) {
            this.treeVis
                .withNodeSize(10)
                .withContainer(this.treeSvgContainer)
                .withData(new TreeLevelScan(this.tree).getFlatKeyArray()).draw();
        }
    }

    private renderAlphaSvg(): void {
        if (this.alphaTreeSvgContainer) {
            this.alphaTreeVis
                .withNodeSize(10)
                .withContainer(this.alphaTreeSvgContainer)
                .withData(new TreeLevelScan(this.alphaTree).getFlatKeyArray()).draw();
        }
    }


}