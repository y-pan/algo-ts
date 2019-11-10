import React from "react";
import {uniqueId} from "../tree/util/TreeUtil";
import {nlb} from "../types/Nullable";
import {TreeVis} from "../tree/vis/TreeVis";
import {TreeLevelScan} from "../tree/processing/TreeLevelScan";
import {RedBlackTree} from "../tree/RedBlackTree";
import {RedBlackTreeNode} from "../tree/RedBlackTreeNode";
import {ArrayVis} from "../linear/ArrayVis";
import {requireEqual, requireNonNull} from "../utils/Type";

interface TreeProps {

}

interface TreeState {
    deleteDisabled: boolean;
    totalInputCount: number; // total input count
    treeDeleteCount: number;
    treeSize: number;
    treeInsertCount: number; // inserting count - when inserting a key not exists in current tree
    treeUpdateCount: number; // when inserting key that already exists in tree, will do update

    prevInsertOrUpdateKey?: number;
    wasInsertion?: boolean;
    prevDeletedKey?: number;

    nextKey: number;
    nextValue: string;
}

export class TreeView extends React.Component<TreeProps, TreeState> {
    private readonly redBlackTree = new RedBlackTree<number, string>();
    private readonly redBlackTreeVis: TreeVis<RedBlackTreeNode<number, string>, number, string> = new TreeVis();
    private treeSvgContainer: nlb<HTMLElement>;

    private inputArray: nlb<number>[] = [];
    private readonly inputArrayVis: ArrayVis<number> = new ArrayVis();
    private inputArraySvgContainer: nlb<HTMLElement>;

    private deletionArray: nlb<number>[] = [];
    private readonly deletionArrayVis: ArrayVis<number> = new ArrayVis();
    private deletionArraySvgContainer: nlb<HTMLElement>;

    constructor(props: TreeProps) {
        super(props);
        (window as any)["tree"] = this.redBlackTree;
        (window as any)["treeVis"] = this.redBlackTreeVis;

        this.redBlackTreeVis
            .withNodeSize(20)
            // .withContainer(this.treeSvgContainer)
            // .withData(levels.getFlatNodeArray())
            .withKeyExtractor((node: nlb<RedBlackTreeNode<number, string>>) => {
                return node == null ? undefined : node.key;
            })
            .withValueExtractor((node: nlb<RedBlackTreeNode<number, string>>) => {
                return node == null ? "" : node.value;
            })
            .withNodeColorProvider((node: nlb<RedBlackTreeNode<number, string>>, i: number) => {
                if (!node) {
                    return "#ffffff";
                } else if (node.isRed()) {
                    return "#ff7f84";
                } else {
                    return "#b7b5bc";
                }
            });

        this.redBlackTreeVis.subscribeNodeDoubleClick((k: number) => this.delete(k));
        this.inputArrayVis.withNodeSize(20);
        this.deletionArrayVis
            .withNodeColorProvider(() => "#ecee54")
            .withNodeTextColor(() => "#b00fec")
            .withNodeSize(20);

        const {key, value} = this.getRandom();

        this.state = {
            deleteDisabled: true,
            totalInputCount: 0,
            treeDeleteCount: 0,
            treeSize: 0,
            treeUpdateCount: 0,
            treeInsertCount: 0,
            prevDeletedKey: undefined,
            prevInsertOrUpdateKey: undefined,
            nextKey: key,
            nextValue: value
        }
    }

    render(): JSX.Element {

        const operations: JSX.Element[] = (
            [
                <span style={{fontWeight: "bold", border: ""}}>({this.state.nextKey}, {this.state.nextValue})</span>,
                <button key={"add"}
                        onClick={() => this.add()}>
                    Add
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
                </button>,

                <button key={"reset"} style={{color: "#ff0000"}}
                        onClick={() => this.reset()}>
                    Reset
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

        const treeStats = (
            <div className={"centered"}>
                <table className={"table-border-simple"}>
                    <thead>
                    <tr>
                        <th>Total Input Count</th>
                        <th>Insertion Count</th>
                        <th>Update Count</th>
                        <th>Deletion Count</th>
                        <th>Current Tree Size</th>
                        <th>Prev Insert/Update Key</th>
                        <th>Prev Deleted Key</th>
                        {/*<th>Next Key</th>*/}
                        {/*<th>Next Value</th>*/}
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>{this.state.totalInputCount}</td>
                        <td>{this.state.treeInsertCount}</td>
                        <td>{this.state.treeUpdateCount}</td>
                        <td>{this.state.treeDeleteCount}</td>
                        <td>{this.state.treeSize}</td>
                        <td style={{color: this.state.wasInsertion ? "#1e9537" : "#0000ff"}}>{this.state.prevInsertOrUpdateKey}</td>
                        <td style={{color: "#ff0000"}}>{this.state.prevDeletedKey}</td>

                        {/*<td>{this.state.nextKey}</td>*/}
                        {/*<td>{this.state.nextValue}</td>*/}

                    </tr>
                    </tbody>
                </table>
            </div>
        );
        return (
            <div>
                {operations}
                {treeStats}
                {inputArraySvg}
                {deletionArraySvg}
                {treeSvg}
            </div>
        );
    }

    // Operations
    private getRandom(): { key: number, value: string } {
        const key: number = Math.floor(Math.random() * 100);
        const value: string = uniqueId(key);
        return {key: key, value: value};
    }

    private add(): void {
        const key = requireNonNull(this.state.nextKey, "Tree requires key non-null");
        const value = requireNonNull(this.state.nextValue, "Tree requires value non-null");

        const treeSizeWas: number = this.redBlackTree.getSize();
        const isInsertion: boolean = !this.redBlackTree.contains(key);

        const treeSizeToBe = isInsertion ? treeSizeWas + 1 : treeSizeWas; // if contains, will do update

        this.inputArray.push(key);
        this.redBlackTree.put(key, value);

        requireEqual(treeSizeToBe, this.redBlackTree.getSize());
        this.afterAddSuccess(key, isInsertion);
    }

    private delete(key: number): void {
        const treeSizeWas: number = this.redBlackTree.getSize();
        const deleted = this.redBlackTree.delete(key);
        if (deleted) {
            requireEqual(treeSizeWas - 1, this.redBlackTree.getSize());
        }
        deleted && this.afterDeletionSuccess(deleted);
    }

    private deleteMin(): void {
        const treeSizeWas: number = this.redBlackTree.getSize();
        const deleted: nlb<RedBlackTreeNode<number, string>> = this.redBlackTree.deleteMin();
        if (deleted) {
            requireEqual(treeSizeWas - 1, this.redBlackTree.getSize());
        }
        deleted && this.afterDeletionSuccess(deleted);
    }

    private deleteMax() {
        const treeSizeWas: number = this.redBlackTree.getSize();
        const deleted: nlb<RedBlackTreeNode<number, string>> = this.redBlackTree.deleteMax();
        if (deleted) {
            requireEqual(treeSizeWas - 1, this.redBlackTree.getSize());
        }

        deleted && this.afterDeletionSuccess(deleted);
    }

    // Do after operations
    private afterAddSuccess(key: number, isInsertion: boolean): void {
        this.renderArraySvg();
        this.renderRedBlackSvg();

        const nextKeyValue = this.getRandom();

        this.setState({
            prevInsertOrUpdateKey: key,
            wasInsertion: isInsertion,
            deleteDisabled: this.redBlackTree.isEmpty(),
            totalInputCount: this.state.totalInputCount + 1,
            treeSize: this.redBlackTree.getSize(),
            treeInsertCount: isInsertion ? this.state.treeInsertCount + 1 : this.state.treeInsertCount,
            treeUpdateCount: isInsertion ? this.state.treeUpdateCount : this.state.treeUpdateCount + 1,

            nextKey: nextKeyValue.key,
            nextValue: nextKeyValue.value
        }, () => {
            requireEqual(this.state.treeInsertCount + this.state.treeUpdateCount, this.state.totalInputCount);
        });
    }

    private afterDeletionSuccess(deleted: RedBlackTreeNode<number, string>): void {
        this.inputArray = this.inputArray.filter(num => num !== deleted.key);
        this.deletionArray.push(deleted.key);
        this.renderArraySvg();
        this.renderRedBlackSvg();
        this.renderDeletionArraySvg();

        this.setState({
            prevDeletedKey: deleted.key,
            deleteDisabled: this.redBlackTree.isEmpty(),
            treeDeleteCount: this.state.treeDeleteCount + 1,
            treeSize: this.redBlackTree.getSize()
        }, () => {
            requireEqual(this.state.treeDeleteCount, this.deletionArray.length);
            requireEqual(this.state.treeDeleteCount + this.state.treeUpdateCount + this.state.treeSize, this.state.totalInputCount);
        });
    }

    // Rendering svg to given dom
    private renderRedBlackSvg(): void {
        this.redBlackTreeVis
            .withContainer(requireNonNull(this.treeSvgContainer))
            .withData(
                new TreeLevelScan(this.redBlackTree).getFlatNodeArray()
            )
            .draw();
    }

    private renderArraySvg(): void {
        this.inputArrayVis
            .withContainer(requireNonNull(this.inputArraySvgContainer))
            .withData(this.inputArray)
            .draw();
    }

    private renderDeletionArraySvg() {
        this.deletionArrayVis.withContainer(requireNonNull(this.deletionArraySvgContainer))
            .withData(this.deletionArray)
            .draw();
    }

    private reset() {
        this.inputArray = [];
        this.deletionArray = [];
        while (!this.redBlackTree.isEmpty()) {
            this.redBlackTree.deleteMin();
        }

        this.renderArraySvg();
        this.renderDeletionArraySvg();
        this.renderRedBlackSvg();

        this.setState({
            totalInputCount: 0,
            treeUpdateCount: 0,
            treeInsertCount: 0,
            treeDeleteCount: 0,
            prevInsertOrUpdateKey: undefined,
            prevDeletedKey: undefined,
            wasInsertion: undefined,
            deleteDisabled: this.redBlackTree.isEmpty(),
            treeSize: this.redBlackTree.getSize()
        });
    }
}