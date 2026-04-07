import Phaser from "phaser";
import GridSystem from "../systems/GridSystem";
import Renderer from "../render/Renderer.js";
import MovementSystem from "../systems/MovementSystem.js";
import Player from "../entites/Player.js";
import * as sceneUtils from "../utils/scene.js";
import * as config from "../configs/config";
import Enemy from "../entites/Enemy.js";

const DEFAULT_TILE_SIZE = config.tiles.defaultSize;

export default class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");

        this.grid = null;
        this.renderer = null;
    }

    preload() {
        sceneUtils.loadSprites(this);
    }

    create() {
        sceneUtils.loadAnims(this);

        let savedGrid = null;
        if (localStorage.getItem("gridData")) {
            savedGrid = JSON.parse(localStorage.getItem("gridData"));
        }

        this.renderer = new Renderer(this);
        this.grid = new GridSystem(this.renderer, savedGrid);

        this.initilizeScene(savedGrid);
        this.setupDebugger();

        this.player = new Player(this.grid, this, this.renderer);
        this.movement = new MovementSystem(this.grid, this.player, this);
        this.enemy = new Enemy(this.renderer, this.grid);
    }

    update(time, delta) {
        this.movement.update();
        this.player.update(this.enemy);
        this.enemy.update(this.player);
        this.grid.save();
    }

    setupDebugger() {
        this.coordText = this.add.text(10, 10, "x: 0, y: 0", {
            fontSize: "16px",
            color: "#ffffff",
            backgroundColor: "#000000"
        }).setDepth(1000).setScrollFactor(0);

        this.hoverRect = this.add.rectangle(0, 0, DEFAULT_TILE_SIZE, DEFAULT_TILE_SIZE, 0xff0000, 0.4)
            .setOrigin(0)
            .setDepth(999);

        this.input.on("pointermove", (pointer) => {
            const gridX = Math.floor(pointer.worldX / DEFAULT_TILE_SIZE);
            const gridY = Math.floor(pointer.worldY / DEFAULT_TILE_SIZE);

            const x = gridX * DEFAULT_TILE_SIZE;
            const y = gridY * DEFAULT_TILE_SIZE;

            this.hoverRect.setPosition(x, y);
            this.coordText.setText(`tile: ${gridX}(${x}), ${gridY}(${y})`);
        });

        this.input.on("pointerdown", (pointer) => {
            const gridX = Math.floor(pointer.worldX / DEFAULT_TILE_SIZE);
            const gridY = Math.floor(pointer.worldY / DEFAULT_TILE_SIZE);

            console.log(this.grid.grid[gridY][gridX]);
        });
    }

    initilizeScene(savedGrid) {
        for (let y = 0; y < this.grid.rows; y++) {
            for (let x = 0; x < this.grid.cols; x++) {
                const grid = this.grid.grid[y][x];

                const options = sceneUtils.getInitializeGridOptions(
                    this.grid.cols,
                    this.grid.rows,
                    grid,
                    savedGrid
                );

                if (!options) continue;

                const sprite = this.renderer.addSprite(options);
                this.grid.updateTile(x, y, sprite);
            }
        }
    }
}
