export class Cell {
    private _neighbors: Set<Cell>;
    get neighbors() {
        return this._neighbors;
    }

    private _f: number;
    get f() {
        return this._f;
    }

    set f(f: number) {
        this._f = f;
    }

    private _g: number;
    get g() {
        return this._g;
    }

    set g(g: number) {
        this._g = g;
    }

    private _h: number;
    get h() {
        return this._h;
    }

    set h(h: number) {
        this._h = h;
    }

    private _previous: Cell;
    private _wall: boolean;
    private _start: boolean;
    private _goal: boolean;
    private _path: boolean;
    private _pathTail: boolean;
    private _open: boolean;
    private _close: boolean;
    private _cameFrom: Cell;

    constructor(public row: number, public col: number) {
        this._f = 0;
        this._g = 0;
        this._h = 0;
        this._neighbors = new Set();
        this._previous = null;
    }

    bindNeighbors(...nbs: Cell[]): void {
        nbs.filter(nb => nb).forEach(nb => {
            this._neighbors.add(nb);
            nb._neighbors.add(this);
        })
    }

    asWall(): void {
        this._wall = true;
        this._start = false;
        this._goal = false;
    }

    asGoal(): void {
        this._goal = true;
        this._start = false;
        this._wall = false;
    }

    asStart(): void {
        this._start = true;
        this._goal = false;
        this._wall = false;
    }

    asPath(): void {
        this._path = true;
    }

    asPathTail(): void {
        this._path = true;
        this._pathTail = true;
    }

    unmarkPath(): void {
        this._path = false;
        this._pathTail = false;
    }

    asOpen(): void {
        this._open = true;
        this._close = false;
    }

    asClose(): void {
        this._close = true;
        this._open = false;
        this._path = false;
    }

    isOpen(): boolean {
        return this._open;
    }

    isClose(): boolean {
        return this._close;
    }

    isWall(): boolean {
        return this._wall;
    }

    isGoal(): boolean {
        return this._goal;
    }

    isStart(): boolean {
        return this._start;
    }

    isPath(): boolean {
        return this._path;
    }

    isPathTail(): boolean {
        return this._pathTail;
    }

    isAt(row: number, col: number): boolean {
        return this.row === row && this.col === col;
    }

    equals(cell: Cell): boolean {
        return cell && cell.row === this.row && cell.col === this.col;
    }

    toString() {
        let str = "-";
        if (this.isWall()) {
            str = "|";
        } else if (this.isStart()) {
            str = "S";
        } else if (this.isGoal()) {
            str = "G";
        } else if (this.isPath()) {
            str = "+";
        }

        return str;
    }

    get cameFrom(): Cell {
        return this._cameFrom;
    }

    set cameFrom(cell: Cell) {
        this._cameFrom = cell;
    }
}