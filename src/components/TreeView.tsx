import React from "react";
import {uniqueId} from "../tree/util/TreeUtil";
import {nlb, Nullable} from "../types/Nullable";
import {TreeVis} from "../tree/vis/TreeVis";
import {TreeLevelScan} from "../tree/processing/TreeLevelScan";
import {RedBlackTree} from "../tree/RedBlackTree";
import {RedBlackTreeNode} from "../tree/RedBlackTreeNode";
import {ArrayVis} from "../linear/ArrayVis";

interface TreeProps {

}

interface TreeState {
    deleteDisabled: boolean;
}

export class TreeView extends React.Component<TreeProps, TreeState> {
    private readonly redBlackTree = new RedBlackTree<number, string>();
    private readonly redBlackTreeVis: TreeVis<RedBlackTreeNode<number, string>, number, string> = new TreeVis();
    private treeSvgContainer: Nullable<HTMLElement>;

    private inputArray: Nullable<number>[] = [];
    private readonly inputArrayVis: ArrayVis<number> = new ArrayVis();
    private inputArraySvgContainer: Nullable<HTMLElement>;

    private readonly deletionArray: Nullable<number>[] = [];
    private readonly deletionArrayVis: ArrayVis<number> = new ArrayVis();
    private deletionArraySvgContainer: Nullable<HTMLElement>;

    constructor(props: TreeProps) {
        super(props);
        (window as any)["treeSvgContainer"] = this.redBlackTree;
        (window as any)["vis"] = this.redBlackTreeVis;

        this.redBlackTreeVis
            .withNodeSize(10)
            // .withContainer(this.treeSvgContainer)
            // .withData(levels.getFlatNodeArray())
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
            });

        this.redBlackTreeVis.subscribeNodeDoubleClick((k: number) => this.delete(k));
        this.deletionArrayVis
            .withNodeColorProvider(() => "#ecee54")
            .withNodeTextColor(() => "#b00fec")
            .withNodeSize(10);

        this.state = {
            deleteDisabled: true
        }
    }

    render(): JSX.Element {

        const operations: JSX.Element[] = (
            [
                <button key={"add-random"}
                        onClick={() => this.addRandom()}>
                    Add Random
                </button>,

                <button key={"delete-min"}
                        onClick={() => this.deleteMin()}
                        disabled={this.state.deleteDisabled}>
                    Delete Min
                </button>,

                <button key={"delete-max"}
                        onClick={() => this.deleteMax()}
                        disabled={this.state.deleteDisabled}>
                    Delete Max
                </button>


            ]
        );

        const inputArraySvg = (
            <div key={"input-array-svg"} className={"svg-container"}
                 ref={ref => this.inputArraySvgContainer = ref}>
            </div>
        );

        const deletionArraySvg = (
            <div key={"deleteion-array-svg"} className={"svg-container"}
                 ref={ref => this.deletionArraySvgContainer = ref}>
            </div>
        );

        const treeSvg = (
            <div key={"tree-svg"} className={"svg-container"}
                 ref={ref => this.treeSvgContainer = ref}>
            </div>
        );

        return (
            <div>
                {operations}
                {inputArraySvg}
                {deletionArraySvg}
                {treeSvg}
            </div>
        );
    }

    // Operations
    private addRandom(): void {
        const key: number = Math.floor(Math.random() * 100);
        const value: string = uniqueId(key);
        this.inputArray.push(key);
        this.redBlackTree.put(key, value);
        this.afterAdd();
    }

    private delete(key: number): void {
        const deleted = this.redBlackTree.delete(key);
        deleted && this.afterDeletion(deleted);
    }

    private deleteMin(): void {
        const deleted: nlb<RedBlackTreeNode<number, string>> = this.redBlackTree.deleteMin();
        deleted && this.afterDeletion(deleted);
    }

    private deleteMax() {
        const deleted: nlb<RedBlackTreeNode<number, string>> = this.redBlackTree.deleteMax();
        deleted && this.afterDeletion(deleted);
    }

    // Do after operations
    private afterAdd(): void {
        this.renderArraySvg();
        this.renderRedBlackSvg();

        this.setState({
            deleteDisabled: this.redBlackTree.isEmpty()
        });
    }

    private afterDeletion(deleted: RedBlackTreeNode<number, string>): void {
        this.inputArray = this.inputArray.filter(num => num !== deleted.key);
        this.deletionArray.push(deleted.key);
        this.renderArraySvg();
        this.renderRedBlackSvg();
        this.renderDeletionArraySvg();

        this.setState({
            deleteDisabled: this.redBlackTree.isEmpty()
        });
    }

    // Rendering svg to given dom
    private renderRedBlackSvg(): void {
        if (this.treeSvgContainer) {
            this.redBlackTreeVis
                .withContainer(this.treeSvgContainer)
                .withData(
                    new TreeLevelScan(this.redBlackTree).getFlatNodeArray()
                )
                .draw();
        }
    }

    private renderArraySvg(): void {
        if (this.inputArraySvgContainer) {
            this.inputArrayVis
                .withContainer(this.inputArraySvgContainer)
                .withData(this.inputArray)
                .draw();
        }
    }

    private renderDeletionArraySvg() {
        if (this.deletionArraySvgContainer) {
            this.deletionArrayVis.withContainer(this.deletionArraySvgContainer)
                .withData(this.deletionArray)
                .draw();
        }
    }
}