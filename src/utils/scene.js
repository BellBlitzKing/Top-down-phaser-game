import * as config from "../configs/config";

const DEFAULT_TILE_SIZE = config.tiles.defaultSize;
const TILE_STATE = config.tiles.state;
const OBJECT_PROBABILITIES = config.objects.probabilities;
const OBJECT_SPRITE_OPTIONS = config.objects.spriteOptions;

export function loadSprites(scene) {
    const sprites = [
        "bush",
        "water",
        "edge",
        "corner",
        "tree",
        "rock"
    ];

    sprites.forEach(name => {
        scene.load.image(name, `/assets/${name}.png`);
    });

    const playerDirs = ["left", "right", "front", "back"];

    playerDirs.forEach(dir => {
        scene.load.spritesheet(`player-${dir}`, `assets/player/player-${dir}.png`, {
            frameWidth: 24,
            frameHeight: 20
        });
    });

    const enemy = ["right", "left"];

    enemy.forEach(dir => {
        scene.load.spritesheet(`enemy-${dir}`, `assets/enemy/enemy-${dir}.png`, {
            frameWidth: 25.5,
            frameHeight: 22
        });
    });

    const enemyDirs = ["attack-left", "attack-right"];

    enemyDirs.forEach(dir => {
        scene.load.spritesheet(`enemy-${dir}`, `assets/enemy/enemy-${dir}.png`, {
            frameWidth: 32,
            frameHeight: 32
        });
    });

    const arrowDirs = ["arrow-right", "arrow-left", "arrow-top", "arrow-bottom"];

    arrowDirs.forEach(dir => {
        scene.load.image(dir, `assets/arrow/${dir}.png`);
    });
}

export function loadAnims(scene) {
    scene.anims.create({
        key: 'walk-left',
        frames: scene.anims.generateFrameNumbers('player-left', { start: 0, end: 7 }),
        frameRate: 8,
        repeat: -1
    });

    scene.anims.create({
        key: 'walk-right',
        frames: scene.anims.generateFrameNumbers('player-right', { start: 0, end: 7 }),
        frameRate: 8,
        repeat: -1
    });

    scene.anims.create({
        key: 'walk-front',
        frames: scene.anims.generateFrameNumbers('player-front', { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1
    });

    scene.anims.create({
        key: 'walk-back',
        frames: scene.anims.generateFrameNumbers('player-back', { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1
    });

    scene.anims.create({
        key: 'enemy-right',
        frames: scene.anims.generateFrameNumbers('enemy-right'),
        frameRate: 8,
        repeat: -1
    });

    scene.anims.create({
        key: 'enemy-left',
        frames: scene.anims.generateFrameNumbers('enemy-left'),
        frameRate: 8,
        repeat: -1
    });

    scene.anims.create({
        key: 'enemy-attack-left',
        frames: scene.anims.generateFrameNumbers('enemy-attack-left'),
        frameRate: 8,
        repeat: -1
    });

    scene.anims.create({
        key: 'enemy-attack-right',
        frames: scene.anims.generateFrameNumbers('enemy-attack-right'),
        frameRate: 8,
        repeat: -1
    });
}

export function getDefaultSpriteOptions(x, y, key, options) {
    return {
        x,
        y,
        key,
        originX: 0,
        originY: 0,
        ...options
    };
}

export function gridToWorld(x, y, offsetX = 0, offsetY = 0) {
    return {
        x: x * DEFAULT_TILE_SIZE + offsetX,
        y: y * DEFAULT_TILE_SIZE + offsetY
    };
}

export function worldToGrid(x, y) {
    return {
        x: Math.floor(x / DEFAULT_TILE_SIZE),
        y: Math.floor(y / DEFAULT_TILE_SIZE)
    };
}

export function getInitializeGridOptions(cols, rows, grid, savedGrid) {
    if (!savedGrid) {
        return getInitializeSpriteOptions(
            grid,
            cols,
            rows
        );
    } else if (grid.data.state === config.tiles.state.EDGE) {
        return getInitializeEdgeOptions(
            grid,
            cols,
            rows,
            grid.data.state
        );
    } else if (grid.data.state !== config.tiles.state.GRASS) {
        return getInitializeObjectOptions(
            grid,
            grid.data.state
        );
    }
}

function getInitializeSpriteOptions(grid, cols, rows) {
    const tileType = grid.data.state;

    if (tileType === TILE_STATE.EDGE) {
        return getInitializeEdgeOptions(grid, cols, rows, tileType);
    }

    const objectType = getObjectForTile(tileType, grid.x, grid.y);
    if (objectType !== null || tileType === TILE_STATE.WATER) {
        return getInitializeObjectOptions(grid, objectType || tileType);
    }
}

function getInitializeEdgeOptions(grid, cols, rows, tileType) {
    const half = DEFAULT_TILE_SIZE / 2;
    const { x: positionX, y: positionY } = gridToWorld(grid.x, grid.y, half, half);
    const options = {
        rotation: getEdgeRotation(grid, cols, rows),
        originX: 0.5,
        originY: 0.5
    };

    const offset = getEdgeOffset(grid, cols, rows);
    const key = isCornerTile(grid.x, grid.y, cols, rows) ? "corner" : tileType;

    return getDefaultSpriteOptions(
        positionX + offset.x,
        positionY + offset.y,
        key,
        options
    );
}

function getInitializeObjectOptions(grid, objectType) {
    const offsetX = OBJECT_SPRITE_OPTIONS[objectType]?.offsetX;
    const offsetY = OBJECT_SPRITE_OPTIONS[objectType]?.offsetY;
    const position = gridToWorld(grid.x, grid.y, offsetX, offsetY);

    return getDefaultSpriteOptions(position.x, position.y, objectType, OBJECT_SPRITE_OPTIONS[objectType]);
}

export function getTileType(x, y, cols, rows) {
    if (isLastTile(x, y, cols, rows)) {
        return config.tiles.state.WATER;
    } else if (isBeforeLastTile(x, y, cols, rows)) {
        return config.tiles.state.EDGE;
    }
}

function isLastTile(x, y, cols, rows) {
    return (
        x === 0 ||
        y === 0 ||
        x === cols - 1 ||
        y === rows - 1
    );
}

function isBeforeLastTile(x, y, cols, rows) {
    return (
        x === 1 ||
        y === 1 ||
        x === cols - 2 ||
        y === rows - 2
    );
}

function isCornerTile(x, y, cols, rows) {
    return (
        (x === 1 && y === 1) ||                 // top-left
        (x === cols - 2 && y === 1) ||          // top-right
        (x === 1 && y === rows - 2) ||          // bottom-left
        (x === cols - 2 && y === rows - 2)      // bottom-right
    );
}

function getEdgeRotation(grid, cols, rows) {
    const { x, y } = grid;

    if (x === cols - 2 && y === rows - 2) return Phaser.Math.DegToRad(270);
    if (y === rows - 2) return Phaser.Math.DegToRad(0);     // bottom
    if (x === 1) return Phaser.Math.DegToRad(90);    // left
    if (y === 1) return Phaser.Math.DegToRad(180);   // top
    if (x === cols - 2
        || (x === cols - 2 && y === rows - 2)
    ) return Phaser.Math.DegToRad(270);   // right

    return 0;
}

function getEdgeOffset(grid, cols, rows) {
    const { x, y } = grid;
    const half = DEFAULT_TILE_SIZE / 2;

    // Corners
    if (x === 1 && y === rows - 2) return { x: 0, y: 0 };             // bottom-left
    if (x === cols - 2 && y === rows - 2) return { x: 0, y: 0 };       // bottom-right
    if (x === 1 && y === 1) return { x: 0, y: 0 };                     // top-left
    if (x === cols - 2 && y === 1) return { x: 0, y: 0 };              // top-right

    // Edges
    if (y === rows - 2) return { x: 0, y: half };     // bottom
    if (y === 1) return { x: 0, y: -half };           // top
    if (x === 1) return { x: -half, y: 0 };           // left
    if (x === cols - 2) return { x: half, y: 0 };     // right

    return { x: 0, y: 0 };
}

function getObjectForTile(state, x, y) {
    if (x === config.centerTile.x || y === config.centerTile.y || state !== TILE_STATE.GRASS) {
        return null;
    }

    const rand = Math.random();

    const treeProb = OBJECT_PROBABILITIES[TILE_STATE.TREE];
    const rockProb = OBJECT_PROBABILITIES[TILE_STATE.ROCK];
    const bushProb = OBJECT_PROBABILITIES[TILE_STATE.BUSH];

    if (rand < treeProb) {
        return TILE_STATE.TREE;
    }

    if (rand < treeProb + rockProb) {
        return TILE_STATE.ROCK;
    }

    if (rand < treeProb + rockProb + bushProb) {
        return TILE_STATE.BUSH;
    }

    return null;
}

export function applyDepth(sprite) {
    const bottomY = sprite.y + sprite.displayHeight * (1 - sprite.originY);
    sprite.setDepth(bottomY);
}
