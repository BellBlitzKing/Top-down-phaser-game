import * as config from "../configs/config";

const TILE_STATE = config.tiles.state;
const UNWALKABLE_STATES = [
    TILE_STATE.WATER,
    TILE_STATE.EDGE,
    TILE_STATE.TREE,
    TILE_STATE.ROCK,
    TILE_STATE.BUSH
];

export default class Tile {
    constructor(state, renderer) {
        this.state = state;
        this.renderer = renderer;
        this.sprite = null;
        this.isWalkable = !UNWALKABLE_STATES.includes(this.state);
    }

    updateTile(sprite) {
        this.sprite = sprite;
        this.state = this.findTileState(sprite?.texture.key) ?? this.state;
        this.isWalkable = !UNWALKABLE_STATES.includes(this.state);
    }

    resetTile() {
        this.sprite = null;
        this.state = TILE_STATE.GRASS;
        this.isWalkable = true;
    }

    findTileState(spriteKey) {
        return Object.values(TILE_STATE).includes(spriteKey) ? spriteKey : null;
    }

    destroy() {
        if (this.sprite)
            this.renderer.vibrateAndDestroy(this.sprite, () => this.resetTile());
    }
}
