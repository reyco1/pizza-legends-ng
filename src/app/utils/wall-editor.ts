import { PADDING } from "../dto/game-object-config.dto";
import { GameObject } from "../game-objects/game-object";
import { OverworldMap } from "../game-objects/overworld-map";
import { Person } from "../game-objects/person";
import { MouseListener } from "./mouse-listener";
import { asTileCoord, withGrid } from "./utilities";

export class WallEditor {

    public showWalls: boolean = false;
    public map: OverworldMap;

    private canvas: HTMLCanvasElement;

    constructor(config: any) {
        this.canvas = config.canvas;
        this.map = config.map;
    }

    init() {
        new MouseListener(this.canvas, (e: any) => {
            const bounds = this.canvas.getBoundingClientRect();
            const scale = 3;
            const x = (e.clientX - bounds.x) / scale;
            const y = (e.clientY - bounds.y) / scale;
            const remove = e.shiftKey
            this.registerClick(x, y, remove);
        });
    }

    update(ctx: CanvasRenderingContext2D) {
        if (this.showWalls) {
            const cameraPerson = this.map.gameObjects.find(obj => obj.name === 'hero') as Person;
            for (const key in this.map.walls) {
                if (Object.prototype.hasOwnProperty.call(this.map.walls, key)) {
                    const coordStr = asTileCoord(key);
                    const [x, y] = coordStr.split(',').map(Number);
                    ctx.fillStyle = '#ff000050';
                    ctx.fillRect(
                        withGrid(10.5) - cameraPerson.x + (x * PADDING),
                        withGrid(6) - cameraPerson.y + (y * PADDING),
                        PADDING, PADDING);
                }
            }
        }
    }

    private registerClick(x: number, y: number, remove: boolean = false) {
        if (this.showWalls) {
            const cameraPerson = this.map.gameObjects.find(obj => obj.name === 'hero') as Person;
            const xCoord = Math.floor((x - withGrid(10.5) + cameraPerson.x) / PADDING);
            const yCoord = Math.floor((y - withGrid(6) + cameraPerson.y) / PADDING);
            if (remove) {
                this.map.removeWall(withGrid(xCoord), withGrid(yCoord));
            } else {
                this.map.addWall(withGrid(xCoord), withGrid(yCoord));
            }
        }
    }
}