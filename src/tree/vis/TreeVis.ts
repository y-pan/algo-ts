import {Supplier} from "../../types/Supplier";
import * as d3 from "d3";
import {TreeStruct} from "../processing/TreeStruct";
import {TreeStructLevel} from "../types/TreeStructLevelMapped";
import {BaseTreeStructLevel} from "../types/TreeStructLevel";
import {isNull} from "../../utils/util";
import {nlb} from "../../types/Nullable";
import {BiFunc} from "../../types/BiFunc";
import {ObjectVis} from "../../types/ObjectVis";
import {Func} from "../../types/Func";
import {TreeNodeLink} from "../types/TreeNodeLink";
import {TreeStructLevelNodeLabel} from "../types/TreeStructLevelNodeLabel";
import {TreeStructLevelNode} from "../types/TreeStructLevelNode";
import {Consumer} from "../../types/Consumer";
import {EventPublisher} from "../../event/EventPublisher";
import {Trigger} from "../../triggers/Trigger";

// T: object
export class TreeVis<T, K extends string | number, V> implements ObjectVis<T, K, V> {

    private nodes: nlb<T>[] = [];
    private keyExt: Func<nlb<T>, nlb<K>> | undefined;
    private valExt: Func<nlb<T>, nlb<V>> | undefined;
    private nodeColorProvider: BiFunc<nlb<T>, number, string> | undefined;
    private nodeSize: Trigger<number>; // nodeSize is the diameter, = radius * 2
    private nodeRadius: number = 10;
    private nodeFontSize: number = 5;
    private _vSpace: number;
    private initialHeight: number;
    private initialWidth: number;

    private svg: any;
    private svgGroup: any;

    private readonly nodeDoubleClickPublisher: EventPublisher<K> = new EventPublisher();

    constructor() {
        this.nodes = [];

        this.nodeSize = new Trigger<number>(20, (value: nlb<number>) => {
            if (value && value > 0) {
                this.nodeRadius = value / 2;
            } else {
                this.nodeRadius = 10;
            }
            this.nodeFontSize = this.nodeRadius;
        });
        this._vSpace = 5;
        this.initialHeight = 50;
        this.initialWidth = 50;
    }

    subscribeNodeDoubleClick(consumer: Consumer<K>): void {
        this.nodeDoubleClickPublisher.subscribe(consumer);
    }

    private publishNodeDoubleClick(key: K): void {
        this.nodeDoubleClickPublisher.publish(key);
    }

    withKeyExtractor(keyExt: Func<nlb<T>, nlb<K>>): TreeVis<T, K, V> {
        this.keyExt = keyExt;
        return this;
    }

    withValueExtractor(valExt: Func<nlb<T>, nlb<V>>): TreeVis<T, K, V> {
        this.valExt = valExt;
        return this;
    }

    withData(array: nlb<T>[]): TreeVis<T, K, V> {
        this.nodes = array;
        return this;
    }

    withNodeColorProvider(colorProvider: BiFunc<nlb<T>, number, string>): TreeVis<T, K, V> {
        this.nodeColorProvider = colorProvider;
        return this;
    }

    withNodeSize(diameter: number): TreeVis<T, K, V> {
        this.nodeSize.value = diameter;
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
                .attr("transform", `translate(${this.nodeRadius}, ${this.nodeRadius})`); // Having a group, easy to redraw everything
        }
        return this;
    }

    draw() {
        this.clear();
        if (!this.nodes || this.nodes.length === 0) return;

        // build tree structure from array _size
        const treeStruct = new TreeStruct(this.nodes.length);// TreeStruct only cares about the _size, and make structure, not the actual values

        // resize svg
        this.resize(((treeStruct.getMaxLevelCapacity()) / 30) * 900, (treeStruct.getMaxHeight() + 1) * (this.nodeRadius + this._vSpace) * 2);

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
        const lines: TreeNodeLink<K>[] = [];
        for (let i = 0; i < level1.mappedNodes.length; i++) {
            const parent = level1.mappedNodes[i];
            const leftChildIndex = i * 2, rightChildIndex = i * 2 + 1;

            if (leftChildIndex < level2.mappedNodes.length) {
                let leftChild = level2.mappedNodes[leftChildIndex];
                lines.push({
                    key1: parent.key,
                    x1: parent.x,
                    y1: parent.y,
                    key2: leftChild.key,
                    x2: leftChild.x,
                    y2: leftChild.y,
                });

                if (rightChildIndex < level2.mappedNodes.length) {
                    let rightChild = level2.mappedNodes[rightChildIndex];
                    lines.push({
                        key1: parent.key,
                        x1: parent.x,
                        y1: parent.y,
                        key2: rightChild.key,
                        x2: rightChild.x,
                        y2: rightChild.y,
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
        const self = this;
        const clas = "level-" + mappedLevel.height;
        this.svgGroup.selectAll("circle." + clas)
            .data(mappedLevel.mappedNodes)
            .enter().append("circle")
            .attr("class", clas)
            .attr("cx", (d: TreeStructLevelNode<K>, i: number) => d.x)
            .attr("cy", (d: TreeStructLevelNode<K>, i: number) => d.y)
            .attr("r", (d: TreeStructLevelNode<K>, i: number) => d.r)
            .attr("fill", (d: TreeStructLevelNode<K>, i: number) => d.fill)
            .attr("stroke", "#ffffff")
            .attr("stroke-width", 2)
            .attr("cursor", "pointer")
            .on("dblclick", function (d: TreeStructLevelNode<K>, i: number, rects: any[]) {
                d.key != null && self.nodeDoubleClickPublisher.publish(d.key);
                // d3.select(this).transition(500).style("fill", d.fill);
            });

        this.svgGroup.selectAll("text." + clas)
            .data(mappedLevel.mappedLabels).enter().append("text").attr("class", clas)
            .text((d: TreeStructLevelNodeLabel<K>, i: number) => d.text)
            .attr("x", (d: TreeStructLevelNodeLabel<K>, i: number) => d.x)
            .attr("y", (d: TreeStructLevelNodeLabel<K>, i: number) => d.y)
            .attr("font-size", this.nodeFontSize)
            .attr("fill", (d: TreeStructLevelNodeLabel<K>) => d.fill)
            .attr("font-weight", "bold")
            .attr("cursor", "pointer")
            // .attr("user-select", "none")
            .on("dblclick", function (d: TreeStructLevelNodeLabel<K>, i: number, rects: any[]) {
                d.key != null && self.nodeDoubleClickPublisher.publish(d.key);
            })
    }

    mapLevel(level: BaseTreeStructLevel, array: nlb<T>[], maxLevelSize: number): TreeStructLevel {

        const size = level.capacity;
        const deltaHSpace = (maxLevelSize / size - 1) * (this.nodeRadius * 2) / 2;

        const cx = (d: nlb<T>, i: number) => (i) * (this.nodeRadius + deltaHSpace) * 2 + deltaHSpace;
        const cy = level.height * (this.nodeRadius + this._vSpace) * 2;

        const mappedNodes: TreeStructLevelNode<K>[] = level.indices.map(i => array[i])
            .map((d: nlb<T>, i) => {
                return {
                    key: this.getKey(d, i),
                    x: cx(d, i),
                    y: cy,
                    r: this.nodeRadius,
                    fill: this.getNodeColor(d, i),
                    stroke: "#ffffff",
                };
            });

        const mappedLabels: TreeStructLevelNodeLabel<K>[] = level.indices.map(i => array[i])
            .map((d: nlb<T>, i: number) => {
                return {
                    key: this.getKey(d, i),
                    text: this.getText(d, i),
                    x: cx(d, i) - this.nodeRadius / 2,
                    y: cy + this.nodeRadius / 3,
                    fill: this.getTextColor(d, i)
                }
            });

        return {...level, mappedNodes: mappedNodes, mappedLabels: mappedLabels};
    }

    private getNodeColor(node: nlb<T>, index: number): string {
        // const emptyColor = "#ffffff";
        // if (!node) return emptyColor;
        return this.nodeColorProvider ? this.nodeColorProvider(node, index) : "#ffffff";
    }

    private getKey(node: nlb<T>, index: number): nlb<K> {
        if (!node) return undefined;
        return this.keyExt ? this.keyExt(node) : undefined;
    }

    private getValue(node: nlb<T>, index: number): nlb<V> {
        if (!node) return undefined;
        return this.valExt ? this.valExt(node) : undefined;
    }

    private getText(d: nlb<T>, i: number): string {
        let k = this.getKey(d, i);
        return isNull(k) ? "" : String(k);
    }

    private getTextColor(d: nlb<T>, i: number) {
        return "#000000";
    }

    private getLineColor(line: TreeNodeLink<K>, index: number): string {
        if (isNull(line.key1) || isNull(line.key2)) return "none";
        return "#00ff55";
    }
}
