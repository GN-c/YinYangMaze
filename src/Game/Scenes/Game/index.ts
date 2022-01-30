import { YangCamera, YinCamera } from "./Cameras";
import Dot from "./Dot";
import MazeTexture from "./MazeTexture";

export default class GameScene extends Phaser.Scene {
  static readonly SIZE = 800;

  MazeTexture: MazeTexture;

  yinCamera: YinCamera;
  yangCamera: YangCamera;

  constructor() {
    super("Game");
  }

  LEVEL = 1;

  create() {
    /**
     * Remove Main camera and create two separate for each part
     */
    this.cameras.remove(this.cameras.main);
    this.yinCamera = new YinCamera(this);
    this.yangCamera = new YangCamera(this);

    /**
     * Create Maze Texture
     */
    this.MazeTexture = new MazeTexture(this, { lineWidth: 8 });
    /** generate maze texture */
    this.MazeTexture.generate(Dot.RADIUS * 2.6, 10);
    /**
     * Create Object for Each Camera
     */
    this.yinCamera.create();
    this.yangCamera.create();

    /** Don't render objects specific to each other */
    this.yinCamera.ignore(this.yangCamera.specificGameObjects);
    this.yangCamera.ignore(this.yinCamera.specificGameObjects);
    // this.startNewLevel();
  }

  startNewLevel() {
    this.LEVEL++;
    this.MazeTexture.generate(Dot.RADIUS * 2.6, 5 + this.LEVEL);
    this.yinCamera.reset();
    this.yangCamera.reset();
  }

  update(time: number, deltaTime: number) {
    this.yinCamera.update(time, deltaTime);
    this.yangCamera.update(time, deltaTime);
  }
}
