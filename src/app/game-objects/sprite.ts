import { OFFSET, PADDING, SpriteConfig, SQUARE_SIZE } from "../dto/game-object-config.dto";
import { withGrid } from "../utils/utilities";
import { GameObject } from "./game-object";

export class Sprite {

    private image: HTMLImageElement;
    private shadow: HTMLImageElement;
    private gameObject: GameObject;
    private isLoaded: boolean = false;
    private isShadowLoaded: boolean = false;
    private useShadow: boolean = false;
    private animations: any;
    private currentAnimation: string;
    private currentAnimationFrame: number;
    private animationFrameLimit: number;
    private animationFrameProgress: number;

    constructor(config: SpriteConfig) {
        this.image = new Image();
        this.image.src = config.src;
        this.image.onload = () => {
            this.isLoaded = true;
        }

        this.useShadow = true;
        this.shadow = new Image();
        if (this.useShadow) {
            this.shadow.src = 'assets/images/characters/shadow.png';
            this.shadow.onload = () => {
                this.isShadowLoaded = true;
            }
        }

        this.animations = config.animations || {
            'idle-down': [[0, 0]],
            'idle-right': [[0, 1]],
            'idle-up': [[0, 2]],
            'idle-left': [[0, 3]],
            'walk-down': [[1, 0], [0, 0], [3, 0], [0, 0]],
            'walk-right': [[1, 1], [0, 1], [3, 1], [0, 1]],
            'walk-up': [[1, 2], [0, 2], [3, 2], [0, 2]],
            'walk-left': [[1, 3], [0, 3], [3, 3], [0, 3]]
        };

        this.currentAnimation = config.currentAnimation || 'idle-down';

        this.currentAnimationFrame = config.currentAnimationFrame || 0;

        this.animationFrameLimit = config.animationFrameLimit || (PADDING * 0.5);

        this.animationFrameProgress = config.animationFrameProgress || this.animationFrameLimit;

        this.gameObject = config.gameObject;
    }

    get frame(): number[] {
        return this.animations[this.currentAnimation][this.currentAnimationFrame];
    }

    setAnimation(key: string) {
        if (this.currentAnimation !== key) {
            this.currentAnimation = key;
            this.currentAnimationFrame = 0;
            this.animationFrameProgress = this.animationFrameLimit;
        }
    }

    updateAnimationProgress() {
        if (this.animationFrameProgress > 0) {
            this.animationFrameProgress--;
            return;
        }

        this.animationFrameProgress = this.animationFrameLimit;
        this.currentAnimationFrame++;

        if (this.frame === undefined) {
            this.currentAnimationFrame = 0;
        }
    }

    draw(ctx: CanvasRenderingContext2D, cameraPerson: GameObject): void {
        const x = this.gameObject.x - OFFSET.x + withGrid(10.5) - cameraPerson.x;
        const y = this.gameObject.y - OFFSET.y + withGrid(6) - cameraPerson.y;

        this.isShadowLoaded && ctx.drawImage(this.shadow, x, y);

        const [frameX, frameY] = this.frame;

        this.isLoaded && ctx.drawImage(
            this.image,
            frameX * SQUARE_SIZE, frameY * SQUARE_SIZE,
            SQUARE_SIZE, SQUARE_SIZE,
            x, y,
            SQUARE_SIZE, SQUARE_SIZE
        );

        this.updateAnimationProgress();
    }
}
