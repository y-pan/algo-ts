import React from "react";
import {AStarPathVis} from "../astar/AStarPathVis";
import {Cell} from "../astar/Cell";
import {AStarPath} from "../astar/AStarPath";
import {Grid} from "../astar/Grid";
import {GeneratorRunner} from "../runners/GeneratorRunner";

export interface AStartPathViewProps {

}

interface AStartPathViewState {
    done: boolean;
    error: any;

    canPause: boolean;
    canNext: boolean;
    canKeepGoing: boolean;
}

const ROWS = 5, COLS = 4;
const sRow = 0, sCol = 0, gRow = Math.floor(ROWS - 1), gCol = Math.floor((COLS - 1));
const wallRate = 0.2;

export class AStarPathView extends React.Component<AStartPathViewProps, AStartPathViewState> {
    private aStar: AStarPath = new AStarPath();
    private aStarVis: AStarPathVis = new AStarPathVis();

    private stepRunner = new GeneratorRunner<Cell[][]>()
        .withTask(() => this.aStar.buildGen())
        .withInterval(100)
        .onStep((result: Cell[][]) => this.aStarVis.withData(result).draw())
        .onDone(() => this.setState({done: true, canNext: false, canPause: false, canKeepGoing: false}))
        .onError((error: any) => this.setState({error: error, done: true}));

    constructor(props: AStartPathViewProps) {
        super(props);

        this.aStarVis
            .withNodeColorProvider((cell: Cell, row: number, col: number) => {
                let color: string = "#d9dad8";
                if (cell) {
                    if (cell.isPath()) {
                        color = cell.isPathTail() ? "#f2ff9a" : "#3ffcff";
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
                        color = cell.isPath() ? "#1e9537" : "#ff08df";
                    }
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
            .withGoal((r, c) => (r === gRow && c === gCol))
            .withWall((r, c) => {
                if (r === sRow && c === sCol) return false;
                if (r === gRow && c === gCol) return false;
                return Math.random() < wallRate;
            });

        this.state = {
            done: false,
            error: null,
            canKeepGoing: false,
            canNext: false,
            canPause: false
        }
    }

    render(): JSX.Element {
        return (
            <div>
                <h1>AStar Path</h1>
                <div>
                    <button disabled={!this.state.canNext} onClick={() => this.next()}>Next</button>
                    <button disabled={!this.state.canPause} onClick={() => this.pause()}>Pause</button>
                    <button disabled={!this.state.canKeepGoing} onClick={() => this.keepGoing()}>Keep Going</button>
                </div>
                <div
                    ref={ref => this.renderSvg(ref)}
                >svg here
                </div>
            </div>
        );
    }

    private renderSvg(ref: HTMLDivElement | null) {
        if (ref) {
            if (this.aStarVis.hasContainer()) return;
            this.aStarVis.withContainer(() => ref);
            this.setState({
                done: false,
                error: null,
                canNext: true,
                canPause: false,
                canKeepGoing: true
            });
            // let gen = this.aStar.buildGen(); //
            // let worker = setInterval(() => {
            //     let next: IteratorResult<any> = gen.next();
            //     if (next.done) {
            //         this.aStarVis.withContainer(() => ref).withData(next.value).draw();
            //         clearInterval(worker);
            //     } else {
            //         this.aStarVis.withContainer(() => ref).withData(next.value).draw();
            //     }
            // }, 100);
        }
    }

    private next(): void {
        this.stepRunner.next();
    }

    private keepGoing(): void {
        this.stepRunner.keepGoing();
        this.setState({
            canKeepGoing: false,
            canNext: false,
            canPause: true
        });
    }

    private pause(): void {
        this.stepRunner.pause();
        this.setState({
            canKeepGoing: true,
            canNext: true,
            canPause: false
        });
    }
}