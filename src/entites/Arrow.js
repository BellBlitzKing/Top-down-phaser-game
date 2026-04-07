import * as sceneUtils from "../utils/scene.js";

export default class Arrow {
    constructor(x, y, dir, grid, renderer) {
        this.x = x;
        this.y = y;
        this.dir = dir;
        this.grid = grid;
        this.renderer = renderer;
        this.sprite = null;
        this.isMoving = false;
        this.isDestroyed = false;

        this.initialize();
    }

    initialize() {
        const world = sceneUtils.gridToWorld(this.x, this.y);

        const options = sceneUtils.getDefaultSpriteOptions(
            world.x,
            world.y,
            `arrow-${this.getKey(this.dir)}`,
            { isImage: false }
        );

        this.sprite = this.renderer.addSprite(options);
    }

    update(enemy) {
        if (this.isMoving || this.isDestroyed) return;

        const dx = this.dir.x;
        const dy = this.dir.y;
        const newX = this.x + dx;
        const newY = this.y + dy;
        const tile = this.grid.get(newX, newY);

        if (!tile || !tile.isWalkable) {
            this.destroy();
            return;
        }

        if (!enemy.isDestroyed && enemy.gridX === newX && enemy.gridY === newY) {
            enemy.destroy();
            this.destroy();
            return;
        }

        const world = sceneUtils.gridToWorld(newX, newY);

        const options = {
            sprite: this.sprite,
            x: world.x,
            y: world.y,
            duration: 100,
            onComplete: () => {
                this.x = newX;
                this.y = newY;
                this.isMoving = false;
            }
        };

        this.renderer.animateSprite(options);
    }

    destroy() {
        this.isDestroyed = true;
        this.renderer.spatter(this.sprite);
    }

    getKey(dir) {
        const { x, y } = dir;

        if (y === 1) return "bottom";
        if (x === -1) return "left";
        if (y === -1) return "top";
        if (x === 1) return "right";

        return 0;
    }
}
