import {Supplier} from "./Supplier";
import {Nullable} from "./Nullable";
import {BiFunc} from "./BiFunc";

interface Vis<T> {
    withData(data: T[]): Vis<T>;
    withNodeColorProvider(colorProvider: BiFunc<Nullable<T>, number, string>): Vis<T>;
    withNodeSize(size: number): Vis<T>;
    withContainer(domeContainer: HTMLElement | Supplier<HTMLElement>): Vis<T>;
    clear(): void;
    draw(): void;
    resize(width: number, height: number): void;
}
