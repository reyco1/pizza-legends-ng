import MapData from 'src/assets/data/maps.json';

import { OverworldConfig, Room } from "../dto/overworld-config.dto";
import { PERSON_WALKING_COMPLETE } from '../events/overworld-event';
import { DirectionInput } from '../utils/direction-input';
import { KeyPressListener } from '../utils/key-press-listener';
import { WallEditor } from '../utils/wall-editor';
import { OverworldMap } from "./overworld-map";
import { Person } from './person';

export class Overworld {

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private map!: OverworldMap;
    private directionInput!: DirectionInput;
    private wallEditor!: WallEditor;

    constructor(config: OverworldConfig) {
        this.canvas = config.canvas;
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    }

    init(roomName: string) {
        this.startMap(roomName)

        this.directionInput = new DirectionInput();
        this.directionInput.init();

        this.wallEditor = new WallEditor({ canvas: this.canvas, map: this.map });
        this.wallEditor.init();

        this.bindActionInput();

        this.bindHeroPositionCheck();

        this.startGameLoop();
    }

    startMap(roomName: string) {
        this.map = new OverworldMap(MapData.rooms.find(room => room.name === roomName) as Room);
        this.map.overworld = this;
        this.map.mountObjects();

        if (this.wallEditor) {
            this.wallEditor.map = this.map;
        }
    }

    bindHeroPositionCheck() {
        document.addEventListener(PERSON_WALKING_COMPLETE, (evt: any) => {
            if (evt.detail.whoName === 'hero') {
                this.map.checkForFootstepCutScene();
            }
        });
    }

    bindActionInput() {
        new KeyPressListener('Enter', () => {
            this.map.checkForActionCutScene();
        });

        new KeyPressListener('Digit1', () => {
            this.wallEditor.showWalls = !this.wallEditor.showWalls;
        });
    }

    startGameLoop(): void {
        const step = () => {

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            const cameraPerson = this.map.gameObjects.find(obj => obj.name === 'hero') as Person;

            this.map.gameObjects.forEach(object => {
                object.update({ arrow: this.directionInput.direction, map: this.map });
            });

            this.map.drawLowerImage(this.ctx, cameraPerson);

            this.map.gameObjects
                .sort((a, b) => a.y - b.y)
                .forEach(object => {
                    object.sprite.draw(this.ctx, cameraPerson);
                });

            this.map.drawUpperImage(this.ctx, cameraPerson);

            this.wallEditor.update(this.ctx);

            requestAnimationFrame(() => step())
        }
        step();
    }

}
