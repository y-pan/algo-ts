import {Supplier} from "./Supplier";
import {Nullable} from "./Nullable";
import {BiFunc} from "./BiFunc";
import {Func} from "./Func";

interface ObjectVis<T, K, V> extends Vis<T> {
    withData(data: Nullable<T>[]):  ObjectVis<T, K, V>;
    withKeyExtractor(keyExt: Func<Nullable<T>, Nullable<K>>): ObjectVis<T, K, V>;
    withValueExtractor(valExt: Func<Nullable<T>, Nullable<V>>): ObjectVis<T, K, V>;
    withNodeColorProvider(colorProvider: BiFunc<Nullable<T>, number, string>):  ObjectVis<T, K, V>;
    withNodeSize(size: number): Vis<T>;
    withContainer(domeContainer: HTMLElement | Supplier<HTMLElement>):  ObjectVis<T, K, V>;
    clear(): void;
    draw(): void;
    resize(width: number, height: number): void;
}
