import * as config from "../configs/config";
import * as sceneUtils from "../utils/scene";

const DEFAULT_TILE_SIZE = config.tiles.defaultSize;

export default class Renderer {
    constructor(scene) {
        this.scene = scene;
    }

    addSprite(options) {
        const {
            x,
            y,
            displayWidth = DEFAULT_TILE_SIZE,
            displayHeight = DEFAULT_TILE_SIZE,
            key,
            originX = 0,
            originY = 0,
            rotation = 0,
            isImage = true,
        } = options;

        const sprite = isImage === true
            ? this.scene.add
                .image(x, y, key)
                .setOrigin(originX, originY)
                .setDisplaySize(displayWidth, displayHeight)
                .setRotation(rotation)
            : this.scene.add
                .sprite(x, y, key)
                .setOrigin(originX, originY)
                .setDisplaySize(DEFAULT_TILE_SIZE, DEFAULT_TILE_SIZE)
                .setRotation(rotation);

        sceneUtils.applyDepth(sprite);

        return sprite;
    }

    animateSprite(options) {
        const { sprite, x, y, duration = 500, onComplete } = options;

        this.scene.tweens.add({
            targets: sprite,
            x,
            y,
            duration,
            ease: "Linear",
            onComplete
        });
    }

    vibrateAndDestroy(sprite, callback) {
        this.scene.tweens.add({
            targets: sprite,
            x: sprite.x + 2,
            duration: 40,
            yoyo: true,
            repeat: 5,
            onComplete: () => {
                this.spatter(sprite);
                callback?.();
            }
        });
    }

    spatter(sprite) {
        const size = 8;
        const tex = sprite.texture.key;
        const spriteX = sprite.x + 10;
        const spriteY = sprite.y;
        sprite.destroy();

        for (let cx = 0; cx < 32; cx += size) {
            for (let cy = 0; cy < 32; cy += size) {

                const piece = this.scene.add.image(
                    spriteX,
                    spriteY,
                    tex
                );

                piece.setCrop(cx, cy, size, size);
                piece.setOrigin(0.5);

                const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);

                this.scene.tweens.add({
                    targets: piece,
                    x: spriteX + Math.cos(angle) * 40,
                    y: spriteY + Math.sin(angle) * 40,
                    alpha: 0,
                    duration: 800,
                    onComplete: () => piece.destroy()
                });
            }
        }
    }
}
