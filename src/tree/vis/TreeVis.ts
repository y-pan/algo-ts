import {Supplier} from "../../types/Supplier";
import * as d3 from "d3";
import {TreeStruct} from "../processing/TreeStruct";
import {TreeStructLevel} from "../types/TreeStructLevelMapped";
import {BaseTreeStructLevel} from "../types/TreeStructLevel";
import {isNull} from "../../utils/util";
import {Nullable} from "../../types/Nullable";
import {BiFunc} from "../../types/BiFunc";
import {ObjectVis} from "../../types/ObjectVis";
import {Func} from "../../types/Func";

export class TreeVis<T, K, V> implements ObjectVis<T, K, V> {

    private nodes: Nullable<T>[] = [];
    private keyExt: Func<Nullable<T>, Nullable<K>> | undefined;
    private valExt: Func<Nullable<T>, Nullable<V>> | undefined;
    private nodeColorProvider: BiFunc<Nullable<T>, number, string> | undefined;
    private nodeSize: number = 15;
    private _vSpace: number = 5;
    private initialHeight: number = 50;
    private initialWidth: number = 50;

    private svg: any;
    private svgGroup: any;

    constructor() {
        this.nodes = [];
        this.nodeSize = 15;
        this._vSpace = 5;
    }

    withKeyExtractor(keyExt: Func<Nullable<T>, Nullable<K>>): TreeVis<T, K, V> {
        this.keyExt = keyExt;
        return this;
    }
    withValueExtractor(valExt: Func<Nullable<T>, Nullable<V>>): TreeVis<T, K, V> {
        this.valExt = valExt;
        return this;
    }

    withData(array: Nullable<T>[]): TreeVis<T, K, V> {
        this.nodes = array;
        return this;
    }

    withNodeColorProvider(colorProvider: BiFunc<Nullable<T>, number, string>): TreeVis<T, K, V> {
        this.nodeColorProvider = colorProvider;
        return this;
    }

    withNodeSize(nodeCircleRadius: number): TreeVis<T, K, V> {
        nodeCircleRadius && (this.nodeSize = nodeCircleRadius);
        return this;
    }

    vSpace(verticalLevelSpacing: number): TreeVis<T, K, V> {
        this._vSpace = verticalLevelSpacing;
        return this;
    }

    withContainer(domElementOrFunc: HTMLElement | Supplier<HTMLElement>): TreeVis<T, K, V> {
        if (!this.svg) {
            const domContainer = (typeof domElementOrFunc === "function") ? domElementOrFunc() : domElementOrFunc;
            if (!domContainer) {
                throw new Error("Dom element not found");
            }
            this.svg = d3.select(domContainer)
                .append("svg")
                .attr("width", 800)
                .attr("height", 300);

            this.svgGroup = this.svg.append("g")
                .attr("transform", `translate(${this.nodeSize}, ${this.nodeSize})`); // Having a group, easy to redraw everything
        }
        return this;
    }

    draw() {
        this.clear();
        if (!this.nodes || this.nodes.length === 0) return;

        // build tree structure from array _size
        const treeStruct = new TreeStruct(this.nodes.length);// TreeStruct only cares about the _size, and make structure, not the actual values

        // resize svg
        this.resize(((treeStruct.getMaxLevelCapacity()) / 30) * 900, (treeStruct.getMaxHeight() + 1) * (this.nodeSize + this._vSpace) * 2);

        // use structure to map each level
        const mappedLevels: TreeStructLevel[] = [];
        treeStruct.forEachLevel((level) => {
            /*level : {height: height, indices: this.heightToIndices[height], capacity: this.getLevelCapacity(index)}*/
            mappedLevels.push(this.mapLevel(level, this.nodes, treeStruct.getMaxLevelCapacity())); // map data ready to draw
        });

        // draw nodes' connections (lines)
        let prevLevel: TreeStructLevel;
        mappedLevels.forEach(level => {
            if (!prevLevel) {
                prevLevel = level;
            } else {
                this.drawLevelConnections(prevLevel, level); // draw connection lines, before drawing any node.
                prevLevel = level;
            }
        });

        // draw nodes
        mappedLevels.forEach(level => {
            this.drawLevel(level); // draw nodes, node labels. So node/labels will be on top of lines, looking better
        });

        return this;
    }

    clear(): void {
        this.svgGroup.selectAll("circle").remove();
        this.svgGroup.selectAll("line").remove();
        this.svgGroup.selectAll("text").remove();
    }

    resize(width: number, height: number): void {
        this.svg
            .attr("width", Math.max(this.initialWidth, width))
            .attr("height",  Math.max(this.initialHeight, height));
    }

    drawLevelConnections(level1: TreeStructLevel, level2: TreeStructLevel): void {
        const lines: NodeConnection[] = [];
        for (let i = 0; i < level1.mappedNodes.length; i++) {
            const parent = level1.mappedNodes[i];
            const isParentEmpty: boolean = level1.mappedNodes[i].isEmpty;
            const leftChildIndex = i * 2, rightChildIndex = i * 2 + 1;

            if (leftChildIndex < level2.mappedNodes.length) {
                let leftChild = level2.mappedNodes[leftChildIndex];
                lines.push({
                    x1: parent.x,
                    y1: parent.y,
                    x2: leftChild.x,
                    y2: leftChild.y,
                    isParentEmpty: isParentEmpty,
                    isChildEmpty: leftChild.isEmpty
                });

                if (rightChildIndex < level2.mappedNodes.length) {
                    let rightChild = level2.mappedNodes[rightChildIndex];
                    lines.push({
                        x1: parent.x,
                        y1: parent.y,
                        x2: rightChild.x,
                        y2: rightChild.y,
                        isParentEmpty: isParentEmpty,
                        isChildEmpty: rightChild.isEmpty
                    });
                }
            }
        }

        const clas = "tree-line--" + level1.height + "-" + level2.height;

        this.svgGroup.selectAll("line." + clas)
            .data(lines)
            .enter().append("line")
            .attr("class", clas)
            .attr("x1", (d: any) => d.x1)
            .attr("y1", (d: any) => d.y1)
            .attr("x2", (d: any) => d.x2)
            .attr("y2", (d: any) => d.y2)
            .attr("stroke-width", 1)
            .attr("stroke", this.getLineColor);
    }

    drawLevel(mappedLevel: TreeStructLevel) {// mappedLevel
        if (!mappedLevel) return;
        if (!mappedLevel.hasOwnProperty("mappedNodes") || !mappedLevel.hasOwnProperty("mappedLabels")) {
            throw new Error("Property required: mappedNodes & mappedLabels");
        }
        const clas = "level-" + mappedLevel.height;
        this.svgGroup.selectAll("circle." + clas)
            .data(mappedLevel.mappedNodes)
            .enter().append("circle")
            .attr("class", clas)
            .attr("cx", (d: TreeStructLevelNode, i: number) => d.x)
            .attr("cy", (d: TreeStructLevelNode, i: number) => d.y)
            .attr("r", (d: TreeStructLevelNode, i: number) => d.r)
            .attr("fill", (d: TreeStructLevelNode, i: number) => d.fill)
            .attr("stroke", "#ffffff")
            .attr("stroke-width", 2)
            .on("mouseover", function (d: TreeStructLevelNode, i: number, rects: any[]) {
                // d3.select(d3.selectAll("text." + clas)._groups[0][i]).style("fill", "red")
                // @ts-ignore
                d3.select(this).style("fill", "#c303ff");

            })
            .on("mouseout", function (d: TreeStructLevelNode, i: number, rects: any[]) {
                // @ts-ignore
                d3.select(this).transition(500).style("fill", d.fill);
            });

        this.svgGroup.selectAll("text." + clas)
            .data(mappedLevel.mappedLabels).enter().append("text").attr("class", clas)
            .text((d: TreeStructLevelNodeLabel, i: number) => d.text)
            .attr("x", (d: TreeStructLevelNodeLabel, i: number) => d.x)
            .attr("y", (d: TreeStructLevelNodeLabel, i: number) => d.y)
            .attr("font-size", (d: TreeStructLevelNodeLabel, i: number) => d.fontSize)
            .attr("fill", (d: TreeStructLevelNodeLabel) => d.fill)
            .attr("font-weight", "bold");
    }

    mapLevel(level: BaseTreeStructLevel, array: Nullable<T>[], maxLevelSize: number): TreeStructLevel {

        const size = level.capacity;
        const deltaHSpace = (maxLevelSize / size - 1) * (this.nodeSize * 2) / 2;

        const cx = (d: Nullable<T>, i: number) => (i) * (this.nodeSize + deltaHSpace) * 2 + deltaHSpace;
        const cy = level.height * (this.nodeSize + this._vSpace) * 2;

        const mappedNodes: TreeStructLevelNode[] = level.indices.map(i => array[i])
            .map((d: Nullable<T>, i) => {
                return {
                    x: cx(d, i),
                    y: cy,
                    r: this.nodeSize,
                    fill: this.getNodeColor(d, i),
                    stroke: "#ffffff",
                    isEmpty: Boolean(!d)
                }
            });

        const mappedLabels: TreeStructLevelNodeLabel[] = level.indices.map(i => array[i])
            .map((d: Nullable<T>, i: number) => {
                return {
                    text: this.getText(d, i),
                    x: cx(d, i) - this.nodeSize / 2,
                    y: cy + this.nodeSize / 3,
                    fontSize: this.nodeSize,
                    fill: this.getTextColor(d, i)
                }
            });

        return {...level, mappedNodes: mappedNodes, mappedLabels: mappedLabels};
    }

    private getNodeColor(node: Nullable<T>, index: number): string {
        // const emptyColor = "#ffffff";
        // if (!node) return emptyColor;
        return this.nodeColorProvider ? this.nodeColorProvider(node, index) : "#ffffff";
    }

    private getKey(node: Nullable<T>, index: number): Nullable<K> {
        if (!node) return undefined;
        return this.keyExt ? this.keyExt(node) : undefined;
    }

    private getValue(node: Nullable<T>, index: number): Nullable<V> {
        if (!node) return undefined;
        return this.valExt ? this.valExt(node) : undefined;
    }

    private getText(d: Nullable<T>, i: number): string {
        let k = this.getKey(d, i);
        return isNull(k) ? "" : String(k);
    }

    private getTextColor(d: Nullable<T>, i: number) {
        return "#000000";
    }

    private getLineColor(line: NodeConnection, index: number): string {
        if (line.isParentEmpty || line.isChildEmpty) return "none";
        return "#00ff55";
    }
}

interface NodeConnection {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    isParentEmpty: boolean;
    isChildEmpty: boolean;
}