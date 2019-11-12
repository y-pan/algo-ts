import {Supplier} from "./Supplier";
import {nlb} from "./Nullable";
import {BiFunc} from "./BiFunc";
import {Func} from "./Func";
import {Vis} from "./Vis";

interface ObjectVis<T, K, V> extends Vis<T> {
    withData(data: nlb<T>[]): ObjectVis<T, K, V>;

    withContainer(domeContainer: HTMLElement | Supplier<HTMLElement>): ObjectVis<T, K, V>;

    withKeyExtractor(keyExt: Func<nlb<T>, nlb<K>>): ObjectVis<T, K, V>;

    withValueExtractor(valExt: Func<nlb<T>, nlb<V>>): ObjectVis<T, K, V>;

    withNodeColorProvider(colorProvider: BiFunc<nlb<T>, number, string>): ObjectVis<T, K, V>;
    withNodeSize(size: number): Vis<T>;

    clear(): void;
    draw(): void;
    resize(width: number, height: number): void;
}
