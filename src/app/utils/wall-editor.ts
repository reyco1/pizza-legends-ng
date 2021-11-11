import { HALF_HORIZONTAL_TILES, HALF_VERTICAL_TILES, PADDING } from "../dto/game-object-config.dto";
import { OverworldMap } from "../game-objects/overworld-map";
import { Person } from "../game-objects/person";
import { MouseListener } from "./mouse-listener";
import { asTileCoord, withGrid } from "./utilities";

export class WallEditor {

    public showWalls: boolean = false;
    public map: OverworldMap;

    private canvas: HTMLCanvasElement;
    private scale: number;

    constructor(config: any) {
        this.canvas = config.canvas;
        this.map = config.map;
        this.scale = config.scale;
    }

    init() {
        new MouseListener(this.canvas, (e: any) => {
            const bounds = this.canvas.getBoundingClientRect();
            const x = (e.clientX - bounds.x) / this.scale;
            const y = (e.clientY - bounds.y) / this.scale;
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
                        withGrid(HALF_HORIZONTAL_TILES) - cameraPerson.x + (x * PADDING),
                        withGrid(HALF_VERTICAL_TILES) - cameraPerson.y + (y * PADDING),
                        PADDING, PADDING);
                }
            }
        }
    }

    private registerClick(x: number, y: number, remove: boolean = false) {
        if (this.showWalls) {
            const cameraPerson = this.map.gameObjects.find(obj => obj.name === 'hero') as Person;
            const xCoord = Math.floor((x - withGrid(HALF_HORIZONTAL_TILES) + cameraPerson.x) / PADDING);
            const yCoord = Math.floor((y - withGrid(HALF_VERTICAL_TILES) + cameraPerson.y) / PADDING);
            if (remove) {
                this.map.removeWall(withGrid(xCoord), withGrid(yCoord));
            } else {
                this.map.addWall(withGrid(xCoord), withGrid(yCoord));
            }
        }
    }
}