import {Supplier} from "./Supplier";
import {nlb} from "./Nullable";
import {BiFunc} from "./BiFunc";

interface Vis<T> {
    withData(data: nlb<T>[]): Vis<T>;
    withContainer(domeContainer: HTMLElement | Supplier<HTMLElement>): Vis<T>;

    withNodeColorProvider(colorProvider: BiFunc<nlb<T>, number, string>): Vis<T>; // (item: T, index: number) => string
    withNodeSize(size: number): Vis<T>;

    withNodeText(textProvider: BiFunc<nlb<T>, number, string>): Vis<T>;

    withNodeTextColor(textColorProvider: BiFunc<nlb<T>, number, string>): Vis<T>;

    clear(): void;
    draw(): void;
    resize(width: number, height: number): void;
}
