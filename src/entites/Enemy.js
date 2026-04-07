import * as sceneUtils from "../utils/scene.js";

const ENEMY_STATE = {
    PATROL: 'PATROL',
    CHASE: 'CHASE',
    ATTACK: 'ATTACK'
};

export default class Enemy {
    constructor(renderer, grid) {
        const tile = localStorage.getItem("enemyData") ?
            JSON.parse(localStorage.getItem("enemyData")) : { x: 40, y: 10 };

        this.grid = grid;
        this.gridX = tile.x;
        this.gridY = tile.y;
        this.x = sceneUtils.gridToWorld(tile.x, tile.y).x;
        this.y = sceneUtils.gridToWorld(tile.x, tile.y).y;

        this.renderer = renderer;
        this.sprite = null;

        this.state = ENEMY_STATE.PATROL;
        this.visionRange = 4;
        this.attackRange = 1;
        this.directions = [
            { x: 1, y: 0 },   // right
            { x: 0, y: 1 },   // down
            { x: -1, y: 0 },  // left
            { x: 0, y: -1 }   // up
        ];
        this.currentDirIndex = 2;
        this.stepsTaken = 0;
        this.stepsPerSide = 8;
        this.moveDelay = 500; // ms
        this.canMove = true;

        this.dir = { x: 0, y: 0 };
        this.initialize();
    }

    initialize() {
        const options = sceneUtils.getDefaultSpriteOptions(this.x, this.y, "enemy-right", { isImage: false });
        this.sprite = this.renderer.addSprite(options);
    }

    update(player) {
        if (!this.canMove || this.isDestroyed) return;

        sceneUtils.applyDepth(this.sprite);

        const dist = this.getDistance(player);

        if (dist <= this.attackRange) {
            this.state = ENEMY_STATE.ATTACK;
        } else if (dist <= this.visionRange) {
            this.state = ENEMY_STATE.CHASE;
        } else {
            this.state = ENEMY_STATE.PATROL;
        }

        if (this.state === ENEMY_STATE.PATROL) {
            this.patrol();
        } else if (this.state === ENEMY_STATE.CHASE) {
            this.chase(player);
        } else if (this.state === ENEMY_STATE.ATTACK) {
            this.attack(player);
        }

        localStorage.setItem("enemyData", JSON.stringify({ x: this.gridX, y: this.gridY }));
    }

    getDistance(player) {
        const dx = player.gridX - this.gridX;
        const dy = player.gridY - this.gridY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    patrol() {
        let dir = this.directions[this.currentDirIndex];

        const moved = this.tryMove(dir.x, dir.y);

        if (!moved) {
            this.changeDiection();
            dir = this.directions[this.currentDirIndex];
            this.tryMove(dir.x, dir.y);
        }

        this.stepsTaken++;

        if (this.stepsTaken >= this.stepsPerSide) {
            this.changeDiection();
        }
    }

    changeDiection() {
        this.stepsTaken = 0;
        this.currentDirIndex =
            (this.currentDirIndex + 1) % this.directions.length;
    }

    tryMove(dx, dy) {
        const newX = this.gridX + dx;
        const newY = this.gridY + dy;

        const tile = this.grid.get(newX, newY);
        if (!tile || !tile.isWalkable) return false;

        const world = sceneUtils.gridToWorld(newX, newY);

        this.canMove = false;

        let animKey = "enemy-right";
        if (dx === -1) animKey = "enemy-left";

        this.sprite.anims.play(animKey, true);
        const options = {
            sprite: this.sprite,
            x: world.x,
            y: world.y,
            duration: this.moveDelay,
            onComplete: () => {
                this.gridX = newX;
                this.gridY = newY;
                this.canMove = true;
            }
        };

        this.renderer.animateSprite(options);

        return true;
    }

    chase(player) {
        const dx = player.gridX - this.gridX;
        const dy = player.gridY - this.gridY;
        const dir = { x: Math.sign(dx), y: Math.sign(dy) };

        this.tryMove(dir.x, dir.y);
    }

    attack(player) {
        const animKey = player.gridX < this.gridX ?
            "enemy-attack-left" : "enemy-attack-right";

        this.sprite.anims.play(animKey, true);
    }

    destroy() {
        this.isDestroyed = true;
        this.renderer.spatter(this.sprite);
    }
}
