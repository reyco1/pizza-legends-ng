import { OverworldEvent } from "../../events/overworld-event";
import { GameObjectFactory } from "../../factory/game-object.factory";
import { Room, Behavior } from "../../interfaces/room.interface";
import { nextPosition, withGrid } from "../../utils/utilities";
import { GameObject } from "../../game-objects/game-object";
import { Person } from "../../game-objects/person";
import { Overworld } from "src/app/factory/overworld";

export class OverworldMap {

    private lowerImage: HTMLImageElement;
    private upperImage: HTMLImageElement;
    private cutsceneSpaces: { [key: string]: any[] };

    public overworld: Overworld | null = null;
    public gameObjects: GameObject[];
    public cutScenePlaying: boolean = false;
    public showWalls: boolean = false;
    public walls: { [key: string]: boolean };

    constructor(config: Room) {
        this.gameObjects = GameObjectFactory.createGameObjects(config.gameObjects);

        this.walls = config.walls ? GameObjectFactory.parseWalls(config.walls) : {};
        this.cutsceneSpaces = config.cutsceneSpaces ? GameObjectFactory.parseCutsceneSpaces(config.cutsceneSpaces) : {};

        this.lowerImage = new Image();
        this.lowerImage.src = config.lowerSrc;

        this.upperImage = new Image();
        this.upperImage.src = config.upperSrc;
    }

    drawLowerImage(ctx: CanvasRenderingContext2D, cameraPerson: GameObject): void {
        ctx.drawImage(this.lowerImage, withGrid(10.5) - cameraPerson.x, withGrid(6) - cameraPerson.y);
    }

    drawUpperImage(ctx: CanvasRenderingContext2D, cameraPerson: GameObject): void {
        ctx.drawImage(this.upperImage, withGrid(10.5) - cameraPerson.x, withGrid(6) - cameraPerson.y);
    }

    isSpaceTaken(currX: number, currY: number, direction: string) {
        const { x, y } = nextPosition(currX, currY, direction);
        return this.walls[`${x},${y}`] || false;
    }

    mountObjects() {
        this.gameObjects.forEach(obj => {
            obj.mount(this)
        });
    }

    checkForActionCutScene() {
        const hero = this.gameObjects.find(obj => obj.name === 'hero') as Person;
        const nextCoords = nextPosition(hero.x, hero.y, hero.direction);
        const match = this.gameObjects.find(obj => obj.x === nextCoords.x && obj.y === nextCoords.y);
        if (!this.cutScenePlaying && match && match.talking.length > 0) {
            this.startCutScene(match.talking[0].events);
        }
    }

    checkForFootstepCutScene() {
        const hero = this.gameObjects.find(obj => obj.name === 'hero') as Person;
        const match = this.cutsceneSpaces[`${hero.x},${hero.y}`];
        if (!this.cutScenePlaying && match) {
            this.startCutScene(match[0].events);
        }
    }

    async startCutScene(events: any[]) {
        this.cutScenePlaying = true;

        for (let index = 0; index < events.length; index++) {
            const behavioir: Behavior = events[index];
            const eventHandler = new OverworldEvent({
                map: this,
                event: behavioir
            });
            await eventHandler.init();
        }

        this.cutScenePlaying = false;
        this.gameObjects.forEach(object => object.doBehaviorEvent(this));
    }

    addWall(x: number, y: number) {
        this.walls[`${x},${y}`] = true;
    }

    removeWall(x: number, y: number) {
        delete this.walls[`${x},${y}`];
    }

    moveWall(oldX: number, oldY: number, direction: string) {
        this.removeWall(oldX, oldY);
        const { x, y } = nextPosition(oldX, oldY, direction);
        this.addWall(x, y);
    }
}


