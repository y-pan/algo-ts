import React from "react";
import {Tree} from "../tree/Tree";
import {uniqueId} from "../tree/util/TreeUtil";
import {Nullable} from "../types/Nullable";
import {TreeVis} from "../tree/vis/TreeVis";
import {TreeLevelScan} from "../tree/processors/TreeLevelScan";

interface TreeProps {

}

interface TreeState {

}

export class TreeView extends React.Component<TreeProps, TreeState> {
    private readonly tree = new Tree<number, string>();
    private treeSvgContainer: Nullable<HTMLElement> = null;
    private treeVis: TreeVis = new TreeVis();

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

        return (
            <div>
                {operations}
                {svgContainer}
            </div>
        );
    }

    private addRandom(): void {
        const key: number = Math.floor(Math.random() * 10);
        const value: string = uniqueId(key);
        this.tree.put(key, value);
        this.renderSvg(this.tree);
    }

    private renderSvg(tree: Tree<number, string>): void {
        if (this.treeSvgContainer) {
            this.treeVis
                .withContainer(this.treeSvgContainer)
                .withData(new TreeLevelScan(this.tree).getFlatKeyArray()).draw();
        }
    }
}