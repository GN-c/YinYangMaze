import GameScene from "../..";
import Dot from "../../Dot";

export default abstract class Camera extends Phaser.Cameras.Scene2D.Camera {
  constructor(
    public readonly scene: GameScene,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    super(x, y, width, height);

    this.addToScene().updateGeometryMask().addMask();

    this.scene.scale.on(Phaser.Scale.Events.RESIZE, this.handleResize, this);
  }

  abstract mazeImage: Phaser.GameObjects.Image;
  abstract dot: Dot;

  abstract create(): void;

  abstract update(time: number, deltaTime: number): void;

  abstract reset(): void;

  protected geometryMaskGraphics = this.scene.make.graphics({
    fillStyle: { color: 0x000000 },
  });
  abstract updateGeometryMask(): this;

  private addMask() {
    return this.setMask(
      new Phaser.Display.Masks.GeometryMask(
        this.scene,
        this.geometryMaskGraphics
      ),
      true
    );
  }

  get specificGameObjects(): Phaser.GameObjects.GameObject[] {
    return [this.mazeImage, this.dot];
  }

  handleResize() {
    this.updateGeometryMask();
    this.mazeImage.setPosition(this.scene.center.x, this.scene.center.y);
    this.dot.updatePosition();
  }

  addToScene() {
    this.setScene(this.scene);
    this.scene.cameras.addExisting(this, false);
    return this;
  }
}
