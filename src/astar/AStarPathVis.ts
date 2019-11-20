import * as d3 from "d3";
import {Cell} from "./Cell";
import {Supplier} from "../types/Supplier";
import {asNumber} from "../utils/Type";
import {IVis} from "../types/IVis";
import {Trigger} from "../triggers/Trigger";
import {evalOr} from "../utils/util";

export interface MappedData {
    x: number;
    y: number;
    color: string;
}

export class AStarPathVis implements IVis {
    private nodeSize: Trigger<number>;
    private rectWidth: number;
    private rectHeight: number;
    private svgWidth: number = 800;
    private svgHeight: number = 600;
    private initialDraw: boolean;

    private svg: any;
    private data: Cell[][];
    private nodeColor: (cell: Cell, row: number, col: number) => string;
    private mappedData: MappedData[];
    private svgGroup: any; //Selection<ElementTagNameMap[string], any, BaseType, any>;

    //Selection<BaseType, any, BaseType, any>;

    constructor() {
        this.nodeSize = new Trigger<number>(10, (nodeSize: number) => {
            let size = asNumber(nodeSize, 10);
            this.rectHeight = size;
            this.rectWidth = size;
        });
        this.initialDraw = true;
    }

    withContainer(element: Supplier<HTMLElement>): AStarPathVis {
        if (!this.svg) {
            const domContainer = element();
            if (!domContainer) {
                throw new Error("Dom element not found");
            }

            this.svg = d3.select(domContainer)
                .append("svg")
                .attr("width", this.svgWidth)
                .attr("height", this.svgHeight);

            this.svgGroup = this.svg.append("g")
            // .attr("transform", `translate(${this.nodeRadius}, ${this.nodeRadius})`);
        }
        return this;
    }

    withData(data: Cell[][]): AStarPathVis {
        this.data = data;
        this.svgWidth = evalOr(() => (data[0].length * (this.rectWidth + 2)) || 800, 800);
        this.svgHeight = evalOr(() => (data.length * (this.rectHeight + 2)) || 600, 600);

        this.mapData();
        return this;
    }

    withNodeColorProvider(colorProvider: (cell: Cell, row: number, col: number) => string): AStarPathVis {
        this.nodeColor = colorProvider;
        return this;
    }

    withNodeSize(size: number): AStarPathVis {
        this.nodeSize.value = size;
        return this;
    }

    clear(): void {
        if (this.svgGroup) {
            this.svgGroup.selectAll("text").remove();
            this.svgGroup.selectAll("rect").remove();
        }
    }

    draw(): void {
        this.clear();
        if (this.mappedData.length === 0) return;
        if (this.initialDraw) {
            this.svgGroup.selectAll("rect").data(this.mappedData)
                .enter().append("rect")
                .attr("x", (d: MappedData) => d.x)
                .attr("y", (d: MappedData) => d.y)
                .attr("width", (d: MappedData) => this.rectWidth)
                .attr("height", (d: MappedData) => this.rectHeight)
                .attr("fill", (d: MappedData) => d.color)
                .attr("stroke", (d: MappedData) => "#ffffff");
        } else {
            this.svgGroup.selectAll("rect").data(this.mappedData)
                .attr("fill", (d: MappedData) => d.color);
        }

    }

    resize(width: number, height: number): void {
        this.svg
            .attr("width", width)
            .attr("height", height);
    }

    private mapData(): void {
        this.mappedData = [];
        if (!this.data) return;
        this.data.forEach((rows, r) => rows.forEach((cell, c) => {
            this.mappedData.push({
                x: c * this.rectWidth,
                y: r * this.rectHeight,
                color: this.nodeColor(cell, r, c)
            })
        }))
    }

}