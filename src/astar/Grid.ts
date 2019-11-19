import {requireFunction, requireNonNull} from "../utils/Type";

export class Grid<T> {
    private dataProvider: (row: number, col: number) => T;
    private numOfRows: number;
    private numOfColumns: number;

    withData(dataProvider: (row: number, col: number) => T): Grid<T> {
        requireFunction(dataProvider);
        this.dataProvider = dataProvider;
        return this;
    }

    withRows(numOfRows: number): Grid<T> {
        requireNonNull(numOfRows);
        this.numOfRows = numOfRows;
        return this;
    }

    withColumns(numOfColumns: number): Grid<T> {
        requireNonNull(numOfColumns);

        this.numOfColumns = numOfColumns;
        return this;
    }

    build(): number[][] {
        requireFunction(this.dataProvider);
        requireNonNull(this.numOfColumns);
        requireNonNull(this.numOfRows);

        const grid = [];

        for (let r = 0; r < this.numOfRows; r++) {
            grid[r] = [];
            for (let c = 0; c < this.numOfColumns; c++) {
                grid[r][c] = this.dataProvider(r, c);
            }
        }
        return grid;
    }

}
