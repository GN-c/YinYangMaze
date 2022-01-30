import GameScene from "../..";

export default abstract class Camera extends Phaser.Cameras.Scene2D.Camera {
  constructor(
    public readonly scene: GameScene,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    super(x, y, width, height);

    this.addToScene().addMask();
  }

  abstract create(): void;

  abstract update(time: number, deltaTime: number): void;

  abstract get specificGameObjects(): Phaser.GameObjects.GameObject[];

  abstract addMask(): this;

  abstract reset(): void;

  addToScene() {
    this.setScene(this.scene);
    this.scene.cameras.addExisting(this, false);
    return this;
  }
}
