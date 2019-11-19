import {Cell} from "./Cell";
import {arrayOfNonNull, requireAllNonNull, requireFunction, requireNonNull} from "../utils/Type";
import {heristic} from "../utils/util";

export class AStarPath {
    private grid: number[][];
    private wallPredicate: (row: number, column: number) => boolean;
    private goalPredicate: (row: number, column: number) => boolean;
    private startPredicate: (row: number, column: number) => boolean;
    private openSet: Set<Cell>; // todo: priorityQueue
    private closedSet: Set<Cell>;
    private startCell: Cell;
    private goalCell: Cell;
    private gridOfCells: Cell[][];
    private path: Cell[];

    constructor() {
    }

    withGrid(grid: number[][]): AStarPath {// grid of numbers
        requireNonNull(grid);
        this.grid = grid;
        return this;
    }

    withWall(wallPredicate: (row: number, column: number) => boolean): AStarPath {
        requireFunction(wallPredicate);
        this.wallPredicate = wallPredicate;
        return this;
    }

    withStart(startPredicate: (row: number, column: number) => boolean): AStarPath {
        requireFunction(startPredicate);
        this.startPredicate = startPredicate;
        return this;
    }

    withGoal(goalPredicate: (row: number, column: number) => boolean): AStarPath {
        requireFunction(goalPredicate);
        this.goalPredicate = goalPredicate;
        return this;
    }

    * buildGen() {
        this.mapGrid();
        this.setNeighbours();

        //
        requireAllNonNull(this.startCell, this.goalCell);

        // init
        this.openSet = new Set();
        this.closedSet = new Set();
        this.openSet.add(this.startCell);
        let success: boolean = false;

        while (this.openSet.size > 0) {
            // find best step
            this.unmarkPath();

            let best: Cell = this.findBestInOpenSet(); //TODO: use priority queue, instead of set
            requireNonNull(best);
            if (best.equals(this.goalCell)) {
                success = true;
                break;
            }
            this.openSet.delete(best);
            best.asClose();
            this.closedSet.add(best);

            let bestNeighbour: Cell = this.findBestInNeighboursOf(best);

            this.markPathTo(bestNeighbour);
            yield this.gridOfCells; // Such that client can draw
        }

        // done: goal or no path available
        if (success) {
            console.log("Success", this.path);
        } else {
            console.log("No path!")
        }
    }

    private mapGrid(): void {
        requireNonNull(this.grid);
        this.gridOfCells = this.grid.map((row: number[], ri: number) => {
            return row.map((c: number, ci: number) => {
                const cell: Cell = new Cell(ri, ci);
                if (this.wallPredicate(ri, ci)) {
                    cell.asWall();
                } else if (this.startPredicate(ri, ci)) {
                    cell.asStart();
                    this.startCell = cell;
                } else if (this.goalPredicate(ri, ci)) {
                    cell.asGoal();
                    this.goalCell = cell;
                }
                return cell;
            })
        })
    }

    private unmarkPath(): void {
        this.path = [];
        this.gridOfCells.forEach(row => row.forEach(cell => cell.unmarkPath()));
    }

    private markPathTo(cell: Cell): void {
        this.path = [];
        if (!cell) return;

        if (!cell.equals(this.goalCell) && !cell.equals(this.startCell)) {// dont mess up with start & goal
            cell.asPathTail();
        }
        const path = [cell];

        let current = cell.cameFrom;
        while (current) {
            if (!current.equals(this.startCell)) {// dont mess up with start
                current.asPathTail();
            }
            path.push(current);
            current = current.cameFrom;
        }
        this.path = path;
    }


    private setNeighbours() {
        const maxColumnIndex: number = this.grid[0].length - 1;
        this.gridOfCells.forEach((row: Cell[], ri: number) => {
            row.forEach((cell: Cell, ci: number) => {
                let left, top, leftTop, rightTop;
                if (ri > 0) {
                    top = this.gridOfCells[ri - 1][ci];
                }
                if (ci > 0) {
                    left = this.gridOfCells[ri][ci - 1];
                }
                if (ri > 0 && ci > 0) {
                    leftTop = this.gridOfCells[ri - 1][ci - 1];
                }
                if (ri > 0 && ci < maxColumnIndex) {
                    rightTop = this.gridOfCells[ri - 1][ci + 1];
                }
                cell.bindNeighbors(...arrayOfNonNull(top, left, leftTop, rightTop))
            })
        })
    }

    private findBestInOpenSet(): Cell {
        let best: Cell;
        // @ts-ignore
        for (let cell of this.openSet) {
            best = (!best || best.f > cell.f) ? cell : best;
        }
        return best;
    }

    private findBestInNeighboursOf(cell: Cell): Cell {
        let best: Cell = cell;
        cell.neighbors.forEach(nb => {
            //TODO: priorityQueue
            if (nb.isWall() || this.closedSet.has(nb)) {
                // do nothing
            } else {
                let isUpdated = false;
                let tempG = cell.g + 1;
                if (this.openSet.has(nb)) {
                    // nb is open to eval
                    if (tempG < nb.g) { // use smaller g
                        isUpdated = true;
                        nb.g = tempG;
                    } else {
                        // no need to update. current g is smaller
                    }
                } else {
                    // nb is not open yet
                    isUpdated = true;
                    nb.g = tempG;
                    nb.asOpen();
                    this.openSet.add(nb);
                }

                // updated g, so need to update h, f, cameFrom, and use it as best
                if (isUpdated) {
                    nb.h = heristic(nb, this.goalCell);
                    nb.f = nb.g + nb.h;
                    nb.cameFrom = cell;
                    best = nb;
                }
            }
        });

        return best;
    }
}

