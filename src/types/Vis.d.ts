interface Vis {
    data(data: number[]): any;
    nodeSize(size): any;
    container(domeContainer): any;
    clear(): void;
    draw(): void;
    resize(width: number, height: number): void;
    // maxWidth(maxWidth): any;
    // maxHeight(maxHeight): any;
}
