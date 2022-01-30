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
    super(
      scene,
      0,
      scene.center.y - GameScene.RADIUS / 2,
      scene.size.x,
      scene.center.y + GameScene.RADIUS / 2
    );
    this.setBackgroundColor(0xffffff);
  }

  create(): void {
    this.mazeImage = this.scene.add
      .image(this.scene.center.x, this.scene.center.y, MazeTexture.TEXTURE_KEY)
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

    this.setOrigin(0.5, GameScene.RADIUS / 4 / this.height);
  }

  reset(): void {
    this.dot.setCell(this.scene.MazeTexture.startingCell);
  }

  update(_time: number, _deltaTime: number): void {
    const angle = Phaser.Math.Angle.Between(
      this.scene.center.x,
      this.scene.center.y,
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
      .moveTo(0, 0)
      .lineTo(this.scene.center.x, 0)
      .arc(
        this.scene.center.x,
        GameScene.RADIUS / 4,
        GameScene.RADIUS / 4,
        -Math.PI / 2,
        Math.PI / 2
      )
      .arc(
        this.scene.center.x,
        (3 / 4) * GameScene.RADIUS,
        GameScene.RADIUS / 4,
        -Math.PI / 2,
        Math.PI / 2,
        true
      )
      .lineTo(this.scene.size.x, GameScene.RADIUS)
      .lineTo(this.scene.size.x, this.scene.center.y + GameScene.RADIUS / 2)
      .lineTo(0, this.scene.center.y + GameScene.RADIUS / 2)
      .fillPath()
      .setPosition(this.x, this.y);
    return this.setMask(
      new Phaser.Display.Masks.GeometryMask(this.scene, graphics),
      true
    );
  }

  get specificGameObjects(): Phaser.GameObjects.GameObject[] {
    return [this.mazeImage, this.dot];
  }
}
