import { GameObject } from "../game-objects/game-object";

export interface SpriteConfig {
    gameObject: GameObject;
    src: string;
    currentAnimation?: string;
    animations?: any;
    currentAnimationFrame?: number;
    animationFrameLimit?: number;
    animationFrameProgress?: number;
}

export const OFFSET = { x: 8, y: 18 };

export const PADDING = 16;

export const SQUARE_SIZE = 32;