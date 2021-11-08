import { PADDING } from "../config/game-config";
import { OverworldMap } from "../components/overworld/overworld-map";
import { Person } from "../game-objects/person";
import { MouseListener } from "./mouse-listener";
import { asTileCoord, withGrid } from "./utilities";
import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class WallEditor {

    public showWalls: boolean = false;
    public map!: OverworldMap;

    private canvas!: HTMLCanvasElement;
    private scale!: number;

    constructor() { }

    init(config: any) {
        this.canvas = config.canvas;
        this.map = config.map;
        this.scale = config.scale;

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
                        withGrid(10.5) - cameraPerson.x + (x * PADDING),
                        withGrid(6) - cameraPerson.y + (y * PADDING),
                        PADDING, PADDING);
                }
            }
        }
    }

    private registerClick(x: number, y: number, remove: boolean = false) {
        if (this.showWalls) {
            const cameraPerson = this.map.gameObjects.find((obj: any) => obj.name === 'hero') as Person;
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