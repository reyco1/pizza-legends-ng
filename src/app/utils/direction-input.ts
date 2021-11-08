import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class DirectionInput {

    private heldDirections: string[] = [];
    private map: any = {
        'ArrowUp': 'up',
        'KeyW': 'up',
        'ArrowLeft': 'left',
        'KeyA': 'left',
        'ArrowDown': 'down',
        'KeyS': 'down',
        'ArrowRight': 'right',
        'KeyD': 'right',
    }

    constructor() { }

    init() {
        document.addEventListener('keydown', e => {
            const pressedKey: string = e.code as string;
            const dir: string = this.map[pressedKey];
            if (dir && this.heldDirections.indexOf(dir) === -1) {
                this.heldDirections.unshift(dir);
            }
        });

        document.addEventListener('keyup', e => {
            const pressedKey: string = e.code as string;
            const dir: string = this.map[pressedKey];
            const index = this.heldDirections.indexOf(dir);
            if (index > -1) {
                this.heldDirections.splice(index, 1);
            }
        });
    }

    get direction(): string {
        return this.heldDirections[0];
    }

}