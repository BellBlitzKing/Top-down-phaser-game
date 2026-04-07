import Phaser from "phaser";
import MainScene from "./scenes/MainScene";
import * as config from "./configs/config";

const sceneConfig = {
    type: Phaser.AUTO,
    width: config.canvas.size.width,
    height: config.canvas.size.height,
    backgroundColor: config.canvas.backgroundColor,
    scene: [MainScene],
    scale: {
        mode: Phaser.Scale.NONE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
};

new Phaser.Game(sceneConfig);
