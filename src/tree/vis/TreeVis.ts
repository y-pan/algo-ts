import {Supplier} from "../../types/Supplier";
import * as d3 from "d3";
import {TreeStruct} from "../processors/TreeStruct";
import {TreeStructLevel} from "../types/TreeStructLevelMapped";
import {BaseTreeStructLevel} from "../types/TreeStructLevel";
import {isNull} from "../../utils/util";
import {Nullable} from "../../types/Nullable";

export class TreeVis implements Vis<number> {
    private array: Nullable<number>[] = [];
    private nodeSize: number = 15;
    private _vSpace: number = 5;
    private initialHeight: number = 50;
    private initialWidth: number = 50;

    private svg: any;
    private svgGroup: any;

    constructor() {
        this.array = [];
        this.nodeSize = 15;
        this._vSpace = 5;
    }

    withData(array: Nullable<number>[]): TreeVis {
        this.array = array;
        return this;
    }

    withNodeSize(nodeCircleRadius: number): TreeVis {
        nodeCircleRadius && (this.nodeSize = nodeCircleRadius);
        return this;
    }

    vSpace(verticalLevelSpacing: number): TreeVis {
        this._vSpace = verticalLevelSpacing;
        return this;
    }

    withContainer(domElementOrFunc: HTMLElement | Supplier<HTMLElement>): TreeVis {
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
        if (!this.array || this.array.length === 0) return;

        // build tree structure from array size
        const treeStruct = new TreeStruct(this.array.length);// TreeStruct only cares about the size, and make structure, not the actual values

        // resize svg
        this.resize(((treeStruct.getMaxLevelCapacity()) / 30) * 900, (treeStruct.getMaxHeight() + 1) * (this.nodeSize + this._vSpace) * 2);

        // use structure to map each level
        const mappedLevels: TreeStructLevel[] = [];
        treeStruct.forEachLevel((level) => {
            /*level : {height: height, indices: this.heightToIndices[height], capacity: this.getLevelCapacity(index)}*/
            mappedLevels.push(this.mapLevel(level, this.array, treeStruct.getMaxLevelCapacity())); // map data ready to draw
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
        const data = [];
        for (let i = 0; i < level1.mappedNodes.length; i++) {
            const parent = level1.mappedNodes[i];

            const leftChildIndex = i * 2, rightChildIndex = i * 2 + 1;

            if (leftChildIndex < level2.mappedNodes.length) {
                let leftChild = level2.mappedNodes[leftChildIndex];
                data.push({
                    x1: parent.x,
                    y1: parent.y,
                    x2: leftChild.x,
                    y2: leftChild.y
                });

                if (rightChildIndex < level2.mappedNodes.length) {
                    let rightChild = level2.mappedNodes[rightChildIndex];
                    data.push({
                        x1: parent.x,
                        y1: parent.y,
                        x2: rightChild.x,
                        y2: rightChild.y
                    });
                }
            }
        }

        const clas = "tree-line--" + level1.height + "-" + level2.height;

        this.svgGroup.selectAll("line." + clas)
            .data(data)
            .enter().append("line")
            .attr("class", clas)
            .attr("x1", (d: any) => d.x1)
            .attr("y1", (d: any) => d.y1)
            .attr("x2", (d: any) => d.x2)
            .attr("y2", (d: any) => d.y2)
            .attr("stroke-width", 1)
            .attr("stroke", "green");
    }

    drawLevel(mappedLevel: TreeStructLevel) {// mappedLevel
        if (!mappedLevel) return;
        if (!mappedLevel.hasOwnProperty("mappedNodes") || !mappedLevel.hasOwnProperty("mappedLabels")) {
            throw new Error("Property required: mappedNodes & mappedLabels");
        }
        const clas = "level-" + mappedLevel.height;
        this.svgGroup.selectAll("circle." + clas)
            .data(mappedLevel.mappedNodes).enter().append("circle").attr("class", clas)
            .attr("cx", (d: any, i: number) => d.x)
            .attr("cy", (d: any, i: number) => d.y)
            .attr("r", (d: any, i: number) => d.r)
            .attr("fill", (d: any, i: number) => d.fill)
            .attr("stroke", "#ffffff")
            .attr("stroke-width", 2)
            .on("mouseover", function (d: any, i: number, rects: any[]) {
                // d3.select(d3.selectAll("text." + clas)._groups[0][i]).style("fill", "red")
                // @ts-ignore
                d3.select(this).style("fill", "#c303ff");

            })
            .on("mouseout", function (d: any, i: number, rects: any[]) {
                // @ts-ignore
                d3.select(this).transition(500).style("fill", d.fill);
            });

        this.svgGroup.selectAll("text." + clas)
            .data(mappedLevel.mappedLabels).enter().append("text").attr("class", clas)
            .text((d: any, i: number) => d.text)
            .attr("x", (d: any, i: number) => d.x)
            .attr("y", (d: any, i: number) => d.y)
            .attr("font-size", (d: any, i: number) => d.fontSize)
            .attr("fill", "#fffa00");
    }

    mapLevel(level: BaseTreeStructLevel, array: Nullable<number>[], maxLevelSize: number): TreeStructLevel {

        const size = level.capacity;
        const deltaHSpace = (maxLevelSize / size - 1) * (this.nodeSize * 2) / 2;

        const cx = (d: Nullable<number>, i: number) => (i) * (this.nodeSize + deltaHSpace) * 2 + deltaHSpace;
        const cy = level.height * (this.nodeSize + this._vSpace) * 2;

        const mappedNodes: TreeStructLevelNode[] = level.indices.map(i => array[i])
            .map((d: Nullable<number>, i) => {
                return {
                    x: cx(d, i),
                    y: cy,
                    r: this.nodeSize,
                    fill: this.nodeColor(d, i),
                    stroke: "#ffffff",
                }
            });

        const mappedLabels: TreeStructLevelNodeLabel[] = level.indices.map(i => array[i])
            .map((d, i) => {
                return {
                    text: (isNull(d) ? "" : String(d)),
                    x: cx(d, i) - this.nodeSize / 2,
                    y: cy + this.nodeSize / 3,
                    fontSize: this.nodeSize,
                    fill: "red"
                }
            });

        return {...level, mappedNodes: mappedNodes, mappedLabels: mappedLabels};
    }

    nodeColor(value: Nullable<number>, index: number): string {
        const baseColor = "#2140ff";
        const emptyColor = "#cccccc";
        return (isNull(value) || index >= this.array.length) ? emptyColor : baseColor;
    }
}


