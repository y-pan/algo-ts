import React from "react";
import {AStarPathVis} from "../astar/AStarPathVis";
import {Cell} from "../astar/Cell";
import {AStarPath} from "../astar/AStarPath";
import {Grid} from "../astar/Grid";

export interface AStartPathViewProps {

}

interface AStartPathViewState {

}

const START = 1, GOAL = 2, WALL = 3;
const ROWS = 50, COLS = 40;
const sRow = 0, sCol = 0, gRow = ROWS - 1, gCol = COLS - 1;
const wallRate = 0.2;

export class AStarPathView extends React.Component<AStartPathViewProps, AStartPathViewState> {
    private aStar: AStarPath = new AStarPath();
    private aStarVis: AStarPathVis = new AStarPathVis();
    private aStarContainer: HTMLElement;

    constructor(props: AStartPathViewProps) {
        super(props);

        this.aStarVis
            .withNodeColorProvider((cell: Cell, row: number, col: number) => {
                if (!cell) return "#d9dad8";
                let color: string = "#d9dad8";
                if (cell.isPath()) {
                    color = cell.isPathTail() ? "#03ff00" : "#3ffcff";
                } else if (cell.isOpen()) {
                    color = "#8b58ff";
                } else if (cell.isClose()) {
                    color = "#ff0007";
                } else if (cell.isWall()) {
                    color = "#040412";
                }

                if (cell.isStart()) {
                    color = "#ffde09";
                } else if (cell.isGoal()) {
                    color = "#ff08df";
                }
                return color;
            })
            .withNodeSize(8);

        const gridOfNumber: number[][] = new Grid()
            .withRows(ROWS)
            .withColumns(COLS)
            .withData((row, col) => 0)
            .build();

        this.aStar.withGrid(gridOfNumber)
            .withStart((r, c) => r === sRow && c === sCol)
            .withGoal((r, c) => r === gRow && c === gCol)
            .withWall((r, c) => {
                if (r === sRow && c === sCol) return false;
                if (r === gRow && c === gCol) return false;
                return Math.random() < wallRate;
            });
    }

    render(): JSX.Element {
        return (
            <div>
                <h1>AStar Path</h1>
                <div
                    ref={ref => this.renderSvg(ref)}
                ></div>
            </div>
        );
    }

    private renderSvg(ref: HTMLDivElement | null) {
        if (ref) {
            let gen = this.aStar.buildGen(); //
            let worker = setInterval(() => {
                let next: IteratorResult<any> = gen.next();
                if (next.done) {
                    this.aStarVis.withContainer(() => ref).withData(next.value).draw();
                    clearInterval(worker);
                } else {
                    this.aStarVis.withContainer(() => ref).withData(next.value).draw();
                }
            }, 100);
        }
    }
}