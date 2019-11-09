import {nlb} from "../types/Nullable";
import {BiFunc} from "../types/BiFunc";
import * as d3 from "d3";
import {isNull} from "../utils/util";
import {Vis} from "../types/Vis";
import {Supplier} from "../types/Supplier";

export class ArrayVis<T> implements Vis<T> {

    private data: nlb<T>[] = [];

    private container: HTMLElement | Supplier<HTMLElement> | undefined;
    private svg: any;
    private svgGroup: any;
    private nodeColorProvider: BiFunc<nlb<T>, number, string> | undefined;
    private nodeSize: number = 10;
    private nodeTextProvider: BiFunc<nlb<T>, number, string> | undefined;
    private nodeTextColorProvider: BiFunc<nlb<T>, number, string> | undefined;

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
            let dom: nlb<HTMLElement>;
            if (this.container && typeof this.container === "function") {
                dom = this.container();
            } else {
                dom = this.container;
            }
            if (!dom) throw "Dom element is required.";
            this.svg = d3.select(dom).append("svg");
            this.svgGroup = this.svg.append("g");
        }

        this.clear();
        if (!this.data || this.data.length === 0) return;

        this.resize((this.data.length + 1) * this.nodeSize * 2, this.nodeSize * 2);
        const self = this;

        if (this.svgGroup) {
            this.svgGroup.selectAll("rect")
                .data(this.data)
                .enter().append("rect")
                .attr("class", "heap-array-rect")
                .attr("x", (d: nlb<T>, i: number) => self.rectX(d, i))
                .attr("y", (d: nlb<T>, i: number) => self.rectY(d, i))
                .attr("width", this.nodeSize * 2)
                .attr("height", this.nodeSize * 2)
                .attr("fill", (d: nlb<T>, i: number) => this.getNodeColor(d, i))
                .attr("stroke", (d: nlb<T>, i: number) => this.getBorderColor(d, i));


            this.svgGroup.selectAll("text")
                .data(this.data)
                .enter().append("text")
                .text((d: nlb<T>, i: number) => this.getText(d, i))
                .attr("x", (d: nlb<T>, i: number) => this.rectX(d, i) + this.nodeSize / 3)
                .attr("y", (d: nlb<T>, i: number) => this.rectY(d, i) + this.nodeSize)
                .attr("fill", (d: nlb<T>, i: number) => this.getTextColor(d, i))
                .attr("font-size", this.nodeSize)
                .attr("font-weight", "bold");

        }
    }

    resize(width: number, height: number): void {
        if (this.svg) {
            this.svg
                .attr("width", width)
                .attr("height", height);
        }
    }

    withContainer(domeContainer: HTMLElement | Supplier<HTMLElement>): ArrayVis<T> {
        this.container = domeContainer;
        return this;
    }

    withData(data: nlb<T>[]): ArrayVis<T> {
        this.data = data;
        return this;
    }

    withNodeColorProvider(colorProvider: (d: nlb<T>, index: number) => string): ArrayVis<T> {
        this.nodeColorProvider = colorProvider;
        return this;
    }

    withNodeSize(size: number): ArrayVis<T> {
        this.nodeSize = size;
        return this;
    }

    withNodeText(textProvider: BiFunc<nlb<T>, number, string>): Vis<T> {
        this.nodeTextProvider = textProvider;
        return this;
    }

    withNodeTextColor(textColorProvider: BiFunc<nlb<T>, number, string>): Vis<T> {
        this.nodeTextColorProvider = textColorProvider;
        return this;
    }

    private rectX(d: nlb<T>, i: number): number {
        return this.nodeSize * 2 * i;
    }

    private rectY(d: nlb<T>, i: number): number {
        return 0;
    }

    private getNodeColor(d: nlb<T>, index: number): string {
        if (this.nodeColorProvider) {
            return this.nodeColorProvider(d, index);
        }
        if (isNull(d) || index >= this.data.length) return "#cccccc";
        return "#a2eeff";
    }

    private getBorderColor(d: nlb<T>, i: number): string {
        let color: string = "#000070";
        if (isNull(d) || i >= this.data.length) {
            color = "#777777";
        }
        return color;
    }

    private getText(d: nlb<T>, i: number): string {
        if (isNull(d)) return "";
        return String(d);
    }

    private getTextColor(d: nlb<T>, i: number): string {
        let color: string = "#050505";
        if (this.nodeTextColorProvider) {
            color = this.nodeTextColorProvider(d, i);
        }
        return color;
    }
}