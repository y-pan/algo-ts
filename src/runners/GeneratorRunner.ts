import {requireFunction} from "../utils/Type";

export class GeneratorRunner<T> {
    private task: () => Generator<T>;
    private stepConsumer: (result: T) => void;
    private errorConsumer: (error: any) => void;
    private interval: number = 100;
    private generator: Generator<T>;

    private worker: any;
    private doneConsumer: () => void;
    private _isDone: boolean = false;

    constructor() {
    }

    withTask(task: () => Generator<T>): GeneratorRunner<T> {
        this.task = task;
        return this;
    }

    onStep(stepConsumer: (result: T) => void): GeneratorRunner<T> {
        requireFunction(stepConsumer);
        this.stepConsumer = stepConsumer;
        return this;
    }

    onDone(doneConsumer: () => void): GeneratorRunner<T> {
        requireFunction(doneConsumer);
        this.doneConsumer = doneConsumer;
        return this;
    }

    withInterval(millisecons: number): GeneratorRunner<T> {
        this.interval = millisecons;
        return this;
    }

    onError(errorConsumer: (error: any) => void): GeneratorRunner<T> {
        requireFunction(errorConsumer);
        this.errorConsumer = errorConsumer;
        return this;
    }

    keepGoing(): void { // it just execute task, knows nothing about the nature of task
        if (this.isDone()) {
            console.warn("Runner is done.");
            return;
        }

        if (!this.generator) {
            this.generator = this.task();
        }
        if (!this.worker) {
            this.worker = setInterval(() => {
                try {
                    let result: IteratorResult<T> = this.generator.next();
                    this.stepConsumer(result.value);
                    if (result.done) {
                        this.setDone();
                    }
                } catch (e) {
                    this.errorConsumer(e);
                    this.terminateWorker();
                }
            }, this.interval);
        }
    }

    pause(): void {
        this.terminateWorker();
    }

    next(): void {
        if (!this.isDone()) {
            this.terminateWorker();
            this.doNext();
        }
    }

    private terminateWorker(): void {
        if (this.worker) {
            clearInterval(this.worker);
            this.worker = null;
        }
    }

    private doNext(): void {
        if (this._isDone) {
            console.warn("Runner is done.");
            return;
        }
        if (!this.generator) {
            this.generator = this.task();
        }
        let result: IteratorResult<T> = this.generator.next();
        this.stepConsumer(result.value);
        if (result.done) {
            this.setDone();
        }
    }

    isDone(): boolean {
        return this._isDone;
    }

    private setDone() {
        this.terminateWorker();
        this.doneConsumer();
        this._isDone = true;
    }
}