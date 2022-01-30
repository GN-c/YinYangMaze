import Phaser from "phaser";

import GameScene from "./Scenes/Game";

export default class Game extends Phaser.Game {
  constructor(canvas: HTMLCanvasElement) {
    super({
      type: Phaser.WEBGL,
      // backgroundColor: 0x43464b,
      canvas,
      transparent: true,
      scale: {
        mode: Phaser.Scale.ScaleModes.RESIZE,
      },
      width: window.innerWidth,
      height: window.innerHeight,
      roundPixels: true,
      scene: GameScene,
    });
  }
}
