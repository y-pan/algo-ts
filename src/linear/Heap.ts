import {nlb} from "../types/Nullable";
import {CompareFunc} from "../types/CompareFunc";

export class Heap<T extends string | number> {

    private _size: number;
    private readonly comparator: CompareFunc<nlb<T>>;
    private array: nlb<T>[];

    constructor(comparator: CompareFunc<nlb<T>>) { // comparator function: (v1, v2) => -1, 0, 1
        this.comparator = comparator;
        this._size = 0;
        this.array = [];
    }

    add(item: T): void {
        this.array[this._size] = item;
        this._size++;
        this.heapifyUp();
    }

    isEmpty(): boolean {
        return this._size === 0;
    }

    hasNext(): boolean {
        return this._size > 0;
    }

    peek(): nlb<T> {
        return this.array[0];
    }

    pop(): nlb<T> {
        if (this.isEmpty()) throw new Error("No such element");
        let t = this.array[0];
        this.array[0] = this.array[this._size - 1];
        this.array[this._size - 1] = undefined;
        this._size--;
        this.heapifyDown(); // heapifyDown new top
        return t;
    }

    heapifyUp(): void {
        let index = this._size - 1;
        let parentIndex = this.parentIndex(index);

        while (this.isIndexValid(parentIndex)) {

            if (this.less(parentIndex, index)) {
                break;
            }
            this.swap(parentIndex, index);

            index = parentIndex;
            parentIndex = this.parentIndex(index);
        }
    }

    heapifyDown(): void {
        let index = 0;
        let leftChildIndex = this.leftChildIndex(index);

        while (this.isIndexValid(leftChildIndex)) {
            let smallerChildIndex = leftChildIndex;
            let rightChildIndex = leftChildIndex + 1;
            if (this.isIndexValid(rightChildIndex)) {
                if (this.less(rightChildIndex, leftChildIndex)) {
                    smallerChildIndex = rightChildIndex;
                }
            }

            if (this.less(index, smallerChildIndex)) {
                break;
            }
            this.swap(index, smallerChildIndex);

            index = smallerChildIndex;
            leftChildIndex = this.leftChildIndex(index);
        }
    }

    compare(index1: number, index2: number): -1 | 0 | 1 {
        return this.comparator(this.array[index1], this.array[index2]);
    }

    less(index1: number, index2: number): boolean {
        return this.compare(index1, index2) < 0;
    }

    swap(index1: number, index2: number): void {
        const t = this.array[index1];
        this.array[index1] = this.array[index2];
        this.array[index2] = t;
    }

    leftChildIndex(index: number): number {
        return 2 * index + 1;
    }

    isIndexValid(index: number): boolean {
        return index >= 0 && index < this._size;
    }

    parentIndex(index: number): number {
        return Math.floor((index - 1) / 2);
    }

    get size(): number {
        return this._size;
    }
}