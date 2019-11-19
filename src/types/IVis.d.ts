import {Supplier} from "./Supplier";
import {BiFunc} from "./BiFunc";

interface IVis {
    withData(data: any): IVis;

    withContainer(domeContainer: HTMLElement | Supplier<HTMLElement>): IVis;

    withNodeColorProvider(colorProvider: BiFunc<any, number, string>): IVis; // (item: T, index: number) => string
    withNodeSize(size: number): IVis;

    withNodeText?(textProvider: BiFunc<any, number, string>): IVis;

    withNodeTextColor?(textColorProvider: BiFunc<any, number, string>): IVis;

    clear(): void;

    draw(): void;

    resize(width: number, height: number): void;
}
