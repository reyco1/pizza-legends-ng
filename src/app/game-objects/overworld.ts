import MapData from 'src/assets/data/maps.json';
import { OverworldConfig, Room } from "../dto/overworld-config.dto";
import { PERSON_WALKING_COMPLETE } from '../events/overworld-event';
import { DirectionInput } from '../utils/direction-input';
import { KeyPressListener } from '../utils/key-press-listener';
import { MouseListener } from '../utils/mouse-listener';
import { OverworldMap } from "./overworld-map";
import { Person } from './person';

export class Overworld {

    private element: HTMLElement;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private map!: OverworldMap;
    private directionInput!: DirectionInput;

    constructor(config: OverworldConfig) {
        this.element = config.element;
        this.canvas = this.element.querySelector('.game-canvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    }

    init(roomName: string) {
        this.startMap(roomName)

        this.directionInput = new DirectionInput();
        this.directionInput.init();

        this.bindActionInput();

        this.bindMousePress();

        this.bindHeroPositionCheck();

        this.startGameLoop();
    }

    startMap(roomName: string) {
        this.map = new OverworldMap(MapData.rooms.find(room => room.name === roomName) as Room);
        this.map.showWalls = true;
        this.map.overworld = this;
        this.map.mountObjects();
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
        })
    }

    bindMousePress() {
        new MouseListener(this.canvas, (e: any) => {
            const bounds = this.canvas.getBoundingClientRect();
            const scale = 3;
            const x = (e.clientX - bounds.x) / scale;
            const y = (e.clientY - bounds.y) / scale;
            const remove = e.shiftKey
            this.map.registerClick(x, y, remove);
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

            this.map.drawClickedTiles(this.ctx, cameraPerson);

            requestAnimationFrame(() => step())
        }
        step();
    }

}
