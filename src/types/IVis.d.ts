import {Func} from "./Func";

interface IVis {
    withData(data: any): IVis;
    withNodeColorProvider(provider: any): IVis;
    withNodeSize(size: number): IVis;
    withContainer(domeContainerProvider: Func<any, HTMLElement>): IVis;
    clear(): void;
    draw(): void;
    resize(width: number, height: number): void;
}
