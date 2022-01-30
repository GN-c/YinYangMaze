import GameScene from "../..";
import Dot from "../../Dot";
import MazeTexture from "../../MazeTexture";
import Camera from "../Camera";

/**
 * Dark Part
 */
export default class YinCamera extends Camera {
  mazeImage: Phaser.GameObjects.Image;
  dot: Dot;
  constructor(scene: GameScene) {
    super(
      scene,
      (1 / 4) * GameScene.SIZE,
      0,
      (3 / 4) * GameScene.SIZE,
      GameScene.SIZE
    );
    this.setBackgroundColor(0x000000);
  }

  create(): void {
    this.mazeImage = this.scene.add
      .image(GameScene.SIZE / 2, GameScene.SIZE / 2, MazeTexture.TEXTURE_KEY)
      .setOrigin(0.5)
      .setTint(0xffffff);

    this.dot = new Dot(this.scene, this.scene.MazeTexture.startingCell, {
      keys: {
        inward: Phaser.Input.Keyboard.KeyCodes.UP,
        right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
        outward: Phaser.Input.Keyboard.KeyCodes.DOWN,
        left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      },
      color: 0xffffff,
    });

    /**
     * Start following dot with offset so that it aligns properly in yin
     */
    this.startFollow(this.dot, true, 1, 1, 0, 0);

    this.setOrigin(1 / 3, 0.75);
  }
  reset(): void {
    this.dot.setCell(this.scene.MazeTexture.startingCell);
  }

  update(_time: number, _deltaTime: number): void {
    const angle = Phaser.Math.Angle.Between(
      GameScene.SIZE / 2,
      GameScene.SIZE / 2,
      this.dot.x,
      this.dot.y
    );
    this.setRotation(-angle + Math.PI / 2);
  }

  addMask() {
    /**
     * Create Graphics object for geometry mask
     */
    const graphics = this.scene.make
      .graphics({
        fillStyle: { color: 0x000000 },
      })
      .beginPath()
      .arc(
        GameScene.SIZE / 2,
        GameScene.SIZE / 2,
        GameScene.SIZE / 2,
        -Math.PI / 2,
        Math.PI / 2
      )
      .arc(
        GameScene.SIZE / 2,
        (3 / 4) * GameScene.SIZE,
        GameScene.SIZE / 4,
        Math.PI / 2,
        -Math.PI / 2
      )
      .arc(
        GameScene.SIZE / 2,
        (1 / 4) * GameScene.SIZE,
        GameScene.SIZE / 4,
        Math.PI / 2,
        -Math.PI / 2,
        true
      )
      .fillPath();
    return this.setMask(
      new Phaser.Display.Masks.GeometryMask(this.scene, graphics),
      true
    );
  }

  get specificGameObjects(): Phaser.GameObjects.GameObject[] {
    return [this.mazeImage, this.dot];
  }
}
