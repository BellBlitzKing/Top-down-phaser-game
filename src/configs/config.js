export const canvas = {
    size: {
        width: 1376,
        height: 704
    },
    backgroundColor: "#A5C543"
}

export const tiles = {
    defaultSize: 32,
    state: {
        GRASS: "grass",
        WATER: "water",
        EDGE: "edge",
        BUSH: "bush",
        TREE: "tree",
        ROCK: "rock"
    }
}

export const centerTile = {
    x: Math.floor(canvas.size.width / 2 / tiles.defaultSize),
    y: Math.floor(canvas.size.height / 2 / tiles.defaultSize)
}

export const objects = {
    probabilities: {
        [tiles.state.BUSH]: 0.02,
        [tiles.state.ROCK]: 0.01,
        [tiles.state.TREE]: 0.03
    },
    spriteOptions: {
        [tiles.state.ROCK]: {
            displayWidth: tiles.defaultSize / 2,
            displayHeight: tiles.defaultSize / 2,
            offsetX: tiles.defaultSize / 2 / 2,
            offsetY: tiles.defaultSize / 2 / 2
        },
        [tiles.state.TREE]: {
            displayWidth: tiles.defaultSize * 2,
            displayHeight: tiles.defaultSize * 3,
            originX: 0.2,
            originY: 0.7
        }
    }
}
