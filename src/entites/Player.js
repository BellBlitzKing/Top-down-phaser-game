import * as sceneUtils from "../utils/scene.js";
import * as config from "../configs/config";
import Arrow from "./Arrow.js";

export default class Player {
    constructor(grid, scene, renderer) {
        this.grid = grid;

        const tile = localStorage.getItem("playerData") ?
            JSON.parse(localStorage.getItem("playerData")) : config.centerTile;

        this.gridX = tile.x;
        this.gridY = tile.y;
        this.x = sceneUtils.gridToWorld(this.gridX, this.gridY).x;
        this.y = sceneUtils.gridToWorld(this.gridX, this.gridY).y;

        this.scene = scene;
        this.renderer = renderer;
        this.sprite = null;
        this.arrows = [];

        this.dir = { x: 0, y: 0 };
        this.initialize();
    }

    initialize() {
        const options = sceneUtils.getDefaultSpriteOptions(this.x, this.y, "player-front", { isImage: false });
        this.sprite = this.renderer.addSprite(options);

        this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
            .on('up', this.performAction.bind(this));

        this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
            .on('down', this.shootArrow.bind(this));
    }

    performAction() {
        const dir = this.dir;
        const tile = this.grid.get(this.gridX + dir.x, this.gridY + dir.y);
        tile.destroy();
    }

    shootArrow() {
        this.arrows.push(
            new Arrow(this.gridX + this.dir.x, this.gridY + this.dir.y, this.dir, this.grid, this.renderer)
        );
    }

    update(enemy) {
        this.arrows.forEach(arrow => !arrow.isDestroyed && arrow.update(enemy));

        localStorage.setItem("playerData", JSON.stringify({ x: this.gridX, y: this.gridY }));
    }
}
