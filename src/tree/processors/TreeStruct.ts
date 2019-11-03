import {bstHeight, bstWidth} from "../util/TreeUtil";
import {Consumer} from "../../types/Consumer";
import {BaseTreeStructLevel} from "../types/TreeStructLevel";

export class TreeStruct {
    private readonly size: number;
    private readonly heights: number[];
    private readonly capacities: number[];
    private readonly heightToIndices: any[];
    private maxHeight: number = -1;
    private maxWidth: number = -1;

    constructor(size: number) {
        // INDEX - the actual index in 1-d data array
        if (!size) throw new Error("Illegal tree size: " + size);
        this.size = size;
        this.heights = []; // INDEX => height (level)
        this.capacities = []; // INDEX => level capacity
        this.heightToIndices = []; // height (level) => all indices, an array
        this.process();
    }

    process(): void {
        if (this.size < 1) return;
        let i = 1;
        this.maxHeight = -1;
        this.maxWidth = -1;

        while (i <= this.size) {
            let index = i - 1; // 0-base index, same as data in 1 dimension array
            const height = bstHeight(i); // index -> height
            const width = bstWidth(i); // index -> level width

            this.capacities[index] = width;
            this.heights[index] = height;

            this.maxHeight = Math.max(this.maxHeight, height);
            this.maxWidth = Math.max(this.maxWidth, width);

            if (!this.heightToIndices[height]) {
                this.heightToIndices[height] = []; // height -> indexes of the height
            }
            this.heightToIndices[height].push(index);
            i++;
        }
    }

    getHeight(index: number): number { // level
        if (index < 0 || index >= this.size) throw new Error("Index out of bounds: " + index);
        return this.heights[index];
    }

    getLevelCapacity(index: number): number { // level width
        if (index < 0 || index >= this.size) throw new Error("Index out of bounds: " + index);
        return this.capacities[index];
    }

    getMaxHeight(): number {
        return this.maxHeight
    }

    getMaxLevelCapacity(): number {
        return this.maxWidth;
    }

    forEachLevel(levelConsumer: Consumer<BaseTreeStructLevel>): void {
        for (let height = 0; height <= this.maxHeight; height++) {
            let firstIndexOfLevel = this.heightToIndices[height][0];
            let level = this.getLevel(firstIndexOfLevel);
            levelConsumer && levelConsumer(level);
        }
    }

    getLevel(index: number): BaseTreeStructLevel {
        if (index < 0 || index >= this.size) throw new Error("Index out of bounds: " + index);
        let height = this.getHeight(index);
        return {height: height, indices: this.heightToIndices[height], capacity: this.getLevelCapacity(index)};
        // indices may not cover all positions of that level, like not enough size to fill out the bottom level.
        // capacity shows the max size of the level
    }

}