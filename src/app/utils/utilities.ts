import { PADDING } from "../dto/game-object-config.dto";

export function withGrid(n: number): number {
    return n * PADDING;
}

export function asGridCoord(coord: string): string {
    const coords: number[] = coord.split(',').map(str => parseInt(str, 10));
    return `${coords[0] * PADDING},${coords[1] * PADDING}`;
}

export function nextPosition(initX: number, initY: number, direction: string) {
    let x = initX;
    let y = initY;
    const size = PADDING;

    switch (direction) {
        case 'left':
            x -= size;
            break;
        case 'right':
            x += size;
            break;
        case 'up':
            y -= size;
            break;
        case 'down':
            y += size;
            break;
    }
    return { x, y };
}

export function emitEvent(name: string, detail: any) {
    const event = new CustomEvent(name, { detail });
    document.dispatchEvent(event);
}

export function oppositeDirection(direction: string) {
    switch (direction) {
        case 'left':
            return 'right';
        case 'right':
            return 'left';
        case 'up':
            return 'down';
        case 'down':
            return 'up';
        default:
            return 'left'
    }
}