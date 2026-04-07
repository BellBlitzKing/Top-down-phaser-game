import * as sceneUtils from "../utils/scene";

export default class MovementSystem {
    constructor(grid, player, scene) {
        this.grid = grid;
        this.player = player;
        this.scene = scene;

        this.cursors = scene.input.keyboard.createCursorKeys();

        this.canMove = true;
        this.moveDelay = 150; // ms
    }

    update() {
        sceneUtils.applyDepth(this.player.sprite);

        if (!this.canMove) return;

        let dx = 0;
        let dy = 0;

        if (this.cursors.left.isDown) dx -= 1;
        if (this.cursors.right.isDown) dx += 1;
        if (this.cursors.up.isDown) dy -= 1;
        if (this.cursors.down.isDown) dy += 1;

        if (dx === 0 && dy === 0) {
            this.player.sprite.anims.stop();
            return;
        }

        const newGridX = this.player.gridX + dx;
        const newGridY = this.player.gridY + dy;

        const tile = this.grid.get(newGridX, newGridY);
        if (!tile || !tile.isWalkable) return;

        const newY = sceneUtils.gridToWorld(newGridX, newGridY).y;
        const newX = sceneUtils.gridToWorld(newGridX, newGridY).x;
        this.canMove = false;

        let animKey = 'walk-left';

        if (dx === -1) animKey = 'walk-left';
        else if (dx === 1) animKey = 'walk-right';
        else if (dy === -1) animKey = 'walk-back';
        else animKey = 'walk-front';

        this.player.sprite.anims.play(animKey, true);

        this.scene.tweens.add({
            targets: this.player.sprite,
            x: newX,
            y: newY,
            duration: this.moveDelay,
            onComplete: () => {
                this.player.x = newX;
                this.player.y = newY;
                this.player.gridX = newGridX;
                this.player.gridY = newGridY;
                this.player.dir = { x: dx, y: dy };
                this.canMove = true;
            }
        });
    }
}
