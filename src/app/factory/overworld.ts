import MapData from 'src/assets/data/maps.json';
import { DirectionInput } from 'src/app/utils/direction-input';
import { Injectable } from '@angular/core';
import { KeyPressService } from 'src/app/utils/key-press-listener';
import { OverworldConfig } from 'src/app/config/game-config';
import { OverworldMap } from '../components/overworld/overworld-map';
import { Person } from 'src/app/game-objects/person';
import { PERSON_WALKING_COMPLETE } from 'src/app/events/overworld-event';
import { Room } from 'src/app/interfaces/room.interface';
import { WallEditor } from 'src/app/utils/wall-editor';

@Injectable({providedIn: 'root'})
export class Overworld {

    private canvas!: HTMLCanvasElement;
    private ctx!: CanvasRenderingContext2D;
    private map!: OverworldMap;
    private scale!: number;

    constructor(
        private wallEditorService: WallEditor,
        private directionInputService: DirectionInput,
        private keyPressService: KeyPressService
    ) { }

    setConfig(config: OverworldConfig) {
        this.canvas = config.canvas;
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.scale = config.scale || 3;
    }

    init(roomName: string) {
        this.startMap(roomName)

        this.directionInputService.init();

        this.wallEditorService.init({ canvas: this.canvas, map: this.map, scale: this.scale });

        this.bindActionInput();

        this.bindHeroPositionCheck();

        this.startGameLoop();
    }

    startMap(roomName: string) {
        this.map = new OverworldMap(MapData.rooms.find(room => room.name === roomName) as Room);
        this.map.overworld = this;
        this.map.mountObjects();

        if (this.wallEditorService) {
            this.wallEditorService.map = this.map;
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
        this.keyPressService.addkeyPressListener('Enter', () => {
            this.map.checkForActionCutScene();
        });

        this.keyPressService.addkeyPressListener('Digit1', () => {
            this.wallEditorService.showWalls = !this.wallEditorService.showWalls;
        });
    }

    startGameLoop(): void {

        const step = () => {

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            const cameraPerson = this.map.gameObjects.find(obj => obj.name === 'hero') as Person;

            this.map.gameObjects
                .forEach(object => {
                    object.update({ arrow: this.directionInputService.direction, map: this.map });
                });

            this.map.drawLowerImage(this.ctx, cameraPerson);

            this.map.gameObjects
                .sort((a, b) => a.y - b.y)
                .forEach(object => {
                    object.sprite.draw(this.ctx, cameraPerson);
                });

            this.map.drawUpperImage(this.ctx, cameraPerson);

            this.wallEditorService.update(this.ctx);

            requestAnimationFrame(() => step())
        }

        step();
    }


}
