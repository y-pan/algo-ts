interface Vis<T> {
    withData(data: T[]): Vis<T>;
    withNodeSize(size): Vis<T>;
    withContainer(domeContainer): Vis<T>;
    clear(): void;
    draw(): void;
    resize(width: number, height: number): void;
}
