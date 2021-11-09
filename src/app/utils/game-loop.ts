export class GameLoop {
    private fps: number;
    private secondsPassed: number;
    private oldTimeStamp: number;
    private callback: Function;
    private running: boolean;

    constructor(fps: number, callback: Function) {
        this.fps = fps;
        this.secondsPassed = 0;
        this.oldTimeStamp = 0;
        this.callback = callback;
        this.running = false;
    }

    public start(): void {
        this.running = true;
        this.secondsPassed = Date.now();
        this.loop(0)
    }

    public stop(): void {
        this.running = false;
    }

    public getFps(): number {
        return this.fps;
    }

    public isRunning(): boolean {
        return this.running;
    }

    private loop(timeStamp: number): void {
        // Calculate the number of seconds passed since the last frame
        this.secondsPassed = (timeStamp - this.oldTimeStamp) / 1000;
        this.oldTimeStamp = timeStamp;

        // Calculate fps
        this.fps = Math.round(1 / this.secondsPassed);

        // Perform the drawing operation
        this.callback();

        // The loop function has reached it's end. Keep requesting new frames
        window.requestAnimationFrame((time) => this.loop(time));
    }

}