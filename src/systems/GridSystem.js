import Tile from "../world/Tile";
import * as config from "../configs/config";
import * as sceneUtils from "../utils/scene";

const cols = Math.floor(config.canvas.size.width / config.tiles.defaultSize);
const rows = Math.floor(config.canvas.size.height / config.tiles.defaultSize);

export default class GridSystem {
    constructor(renderer, savedGrid) {
        this.cols = cols;
        this.rows = rows;
        this.renderer = renderer;

        this.grid = [];
        this.initialize(savedGrid);
    }

    initialize(savedGrid) {
        for (let y = 0; y < this.rows; y++) {
            this.grid[y] = [];

            for (let x = 0; x < this.cols; x++) {
                let state;
                if (savedGrid && savedGrid[y] && savedGrid[y][x] !== undefined) {
                    state = savedGrid[y][x];
                } else {
                    state = sceneUtils.getTileType(x, y, this.cols, this.rows)
                        ?? config.tiles.state.GRASS;
                }

                this.grid[y][x] = {
                    x,
                    y,
                    data: new Tile(state, this.renderer)
                };
            }
        }
    }

    get(x, y) { return this.grid[y]?.[x]?.data; }

    updateTile(x, y, sprite) {
        this.grid[y][x].data.updateTile(sprite);
    }

    save() {
        const data = this.grid.map(row => row.map(cell => cell.data.state));
        localStorage.setItem("gridData", JSON.stringify(data));
    }
}
