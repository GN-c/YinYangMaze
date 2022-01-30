import GameScene from "../..";
import Dot from "../../Dot";
import MazeTexture from "../../MazeTexture";
import Camera from "../Camera";

/**
 * Light Part
 */
export default class YangCamera extends Camera {
  mazeImage: Phaser.GameObjects.Image;
  dot: Dot;
  constructor(scene: GameScene) {
    super(scene, 0, 0, (3 / 4) * GameScene.SIZE, GameScene.SIZE);
    this.setBackgroundColor(0xffffff);
  }

  create(): void {
    this.mazeImage = this.scene.add
      .image(400, 400, MazeTexture.TEXTURE_KEY)
      .setOrigin(0.5)
      .setTint(0x000000);

    this.dot = new Dot(this.scene, this.scene.MazeTexture.startingCell, {
      keys: {
        inward: Phaser.Input.Keyboard.KeyCodes.S,
        right: Phaser.Input.Keyboard.KeyCodes.A,
        outward: Phaser.Input.Keyboard.KeyCodes.W,
        left: Phaser.Input.Keyboard.KeyCodes.D,
      },
      color: 0x000000,
    });

    /**
     * Start following dot with offset so that it aligns properly in yang
     */
    this.startFollow(this.dot, true, 1, 1, 0, 0);

    this.setOrigin(2 / 3, 0.25);
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
    this.setRotation(-angle - Math.PI / 2);
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
        Math.PI / 2,
        true
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
