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
      scene.center.y - GameScene.RADIUS * 2,
      scene.size.x,
      scene.center.y + GameScene.RADIUS * 2
    );
    this.setBackgroundColor(0xffffff).clearMask();
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

    this.setOrigin(0.5, GameScene.RADIUS / this.height);
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

  updateGeometryMask(): this {
    const verticalOffset = this.scene.center.y - GameScene.RADIUS * 2;
    this.geometryMaskGraphics
      .clear()
      .beginPath()
      .moveTo(0, GameScene.RADIUS * 4)
      .arc(
        Math.min(GameScene.RADIUS * 4, this.scene.center.x - GameScene.RADIUS),
        GameScene.RADIUS * 4,
        GameScene.RADIUS * 4,
        -Math.PI,
        -Math.PI / 2
      )
      .lineTo(this.scene.center.x, 0)
      .arc(
        this.scene.center.x,
        GameScene.RADIUS,
        GameScene.RADIUS,
        -Math.PI / 2,
        Math.PI / 2
      )
      .arc(
        this.scene.center.x,
        3 * GameScene.RADIUS,
        GameScene.RADIUS,
        -Math.PI / 2,
        Math.PI / 2,
        true
      )
      .lineTo(
        Math.max(
          this.scene.center.x + GameScene.RADIUS,
          this.scene.size.x - GameScene.RADIUS * 5
        ),
        GameScene.RADIUS * 4
      )
      .arc(
        Math.max(
          this.scene.center.x + GameScene.RADIUS,
          this.scene.size.x - GameScene.RADIUS * 4
        ),
        0,
        GameScene.RADIUS * 4,
        Math.PI / 2,
        0,
        true
      )
      .lineTo(this.scene.size.x, this.scene.size.y - verticalOffset)
      .lineTo(0, this.scene.size.y - verticalOffset)
      .fillPath()
      .setPosition(0, this.scene.center.y - GameScene.RADIUS * 2);

    return this;
  }

  handleResize(): void {
    super.handleResize();
    this.setViewport(
      0,
      this.scene.center.y - GameScene.RADIUS * 2,
      this.scene.size.x,
      this.scene.center.y + GameScene.RADIUS * 2
    );
  }
}
