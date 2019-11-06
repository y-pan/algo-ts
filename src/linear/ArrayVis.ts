import {Nullable} from "../types/Nullable";
import {BiFunc} from "../types/BiFunc";
import {Func} from "../types/Func";
import {IVis} from "../types/IVis";
import * as d3 from "d3";
import {isNull} from "../utils/util";

export class ArrayVis<T> implements IVis {

    private data: Nullable<T>[] = [];

    private container: undefined| Func<void, Nullable<HTMLElement>>;
    private svg: any;
    private svgGroup: any;
    private colorProvider: BiFunc<Nullable<T>, number, string> | undefined;
    private nodeSize: number = 10;

    constructor() {
    }

    clear(): void {
        if (this.svgGroup) {
            this.svgGroup.selectAll("text").remove();
            this.svgGroup.selectAll("rect").remove();
        }
    }

    draw(): void {
        if (!this.svg) {
            let dom: Nullable<HTMLElement> = this.container ? this.container() : undefined;
            if (!dom) throw "Dom element is required.";
            this.svg = d3.select(dom).append("svg");
            this.svgGroup = this.svg.append("g");
        }

        this.clear();
        this.resize(300, this.nodeSize);
        this.data = this.data || [];
        const self = this;

        if (this.svgGroup) {
            this.svgGroup.selectAll("rect")
                .data(this.data)
                .enter().append("rect")
                .attr("class", "heap-array-rect")
                .attr("x", (d: Nullable<T>, i: number) => self.rectX(d, i))
                .attr("y", (d: Nullable<T>, i: number) => self.rectY(d, i))
                .attr("width", this.nodeSize * 2)
                .attr("height", this.nodeSize * 2)
                .attr("fill", (d: Nullable<T>, i: number) => this.getNodeColor(d, i))
                .attr("stroke", (d: Nullable<T>, i: number) => this.getBorderColor(d, i));
                // .on("mouseover", function (d, i, rects) {
                //     d3.select(this).style("stroke", "#53ff67");
                // })
                // .on("mouseout", function (d, i, rects) {
                //     d3.select(this).transition(500).style("stroke", (d: Nullable<T>, i: number) => self.arrayRectBorderColor(d, i));
                // });

            this.svgGroup.selectAll("text")
                .data(this.data)
                .enter().append("text")
                .text((d: Nullable<T>, i: number) => this.getText(d, i))
                .attr("x", (d: Nullable<T>, i: number) => this.rectX(d, i) + this.nodeSize / 3)
                .attr("y", (d: Nullable<T>, i: number) => this.rectY(d, i) + this.nodeSize)
                .attr("fill", this.getTextColor)
                .attr("font-size", this.nodeSize);

        }
    }

    resize(width: number, height: number): void {
        if (this.svgGroup) {
            this.svgGroup
                .attr("width", width)
                .attr("height", height);
        }
    }

    withContainer(domeContainer: Func<void, Nullable<HTMLElement>>): ArrayVis<T> {
        this.container = domeContainer;
        return this;
    }

    withData(data: Nullable<T>[]): ArrayVis<T> {
        this.data = data;
        return this;
    }

    withNodeColorProvider(colorProvider: (d: Nullable<T>, index: number) => string): ArrayVis<T> {
        this.colorProvider = colorProvider;
        return this;
    }

    withNodeSize(size: number): ArrayVis<T> {
        this.nodeSize = size;
        return this;
    }
    
    rectX(d: Nullable<T>, i: number): number {
        return this.nodeSize * 2 * i;
    }

    rectY(d: Nullable<T>, i: number): number {
        return 0;
    }

    private getNodeColor(d: Nullable<T>, index: number): string {
        if (this.colorProvider) {
            return this.colorProvider(d, index);
        }
        if (isNull(d) || index >= this.data.length) return "#cccccc";
        return "#2c47ff";
    }

    private getBorderColor(d: Nullable<T>, i: number): string {
        if (isNull(d) || i >= this.data.length) return "#777777";
        return "#000070";
    }

    private getText(d: Nullable<T>, i: number): string {
        if (isNull(d)) return "";
        return String(d);
    }

    private getTextColor(d: Nullable<T>, i: number): string {
        return "#ecee54";
    }
}