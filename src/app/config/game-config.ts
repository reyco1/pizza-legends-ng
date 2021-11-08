import { GameObject } from "../game-objects/game-object";

export const OFFSET = { x: 8, y: 18 };

export const PADDING = 16;

export const SQUARE_SIZE = 32;

export const SCALE = 3;

export interface OverworldConfig {
    element: HTMLElement;
    canvas: HTMLCanvasElement;
    scale: number;
}

export interface SpriteConfig {
    gameObject: GameObject;
    src: string;
    currentAnimation?: string;
    animations?: any;
    currentAnimationFrame?: number;
    animationFrameLimit?: number;
    animationFrameProgress?: number;
}