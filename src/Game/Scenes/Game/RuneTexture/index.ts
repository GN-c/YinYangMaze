// import Utils from "../Utils";

// interface Props {
//   width: number;
//   height: number;
//   pixelSize: number;
//   key: string;
// }

// /**
//  * Procedurally Generates Maze,Renders and Adds to Texture manager with key `MAZE`
//  */
// export default class RuneTexture {
//   constructor(private readonly scene: Phaser.Scene, private props: Props) {
//     this.createTexture();
//   }

//   private texture: Phaser.Textures.CanvasTexture;
//   private ctx: CanvasRenderingContext2D;
//   private createTexture() {
//     /**
//      * Creating 2D canvas as texture
//      * We're using 2D canvas because drawing arcs on 2DRenderingContext is much performance friendly and smoother than on webgl
//      * this texture will be uploaded on GPU afterwards
//      */
//     this.texture = this.scene.textures.createCanvas(this.props.key, 100, 100);
//     this.ctx = this.texture.getContext();

//     return this;
//   }

//   generate({ width, height, pixelSize }: Omit<Props, "key">) {
//     const textureWidth = width * pixelSize,
//       textureHeight = height * pixelSize;
//     /**
//      * Check if it's same size, we don't need to resize the texture
//      */
//     if (
//       this.texture.width !== textureWidth ||
//       this.texture.height !== textureHeight
//     )
//       this.texture.setSize(textureWidth, textureHeight);

//     /**
//      * Render to texture
//      */
//     this.render();

//     /**
//      * Update Texture
//      */
//     this.texture.refresh();
//   }

//   // private render() {
//   //   /**
//   //    * Reset transform, Clear and translate canvas to the center
//   //    */
//   //   this.ctx.resetTransform();
//   //   this.ctx.clearRect(0, 0, this.size, this.size);
//   //   this.ctx.translate(this.offset, this.offset);
//   //   this.setStyle();
//   // }

//   // private setStyle() {
//   //   /**
//   //    * Set Style
//   //    */
//   //   this.ctx.lineCap = "round";
//   //   this.ctx.lineWidth = this.style.lineWidth;
//   //   this.ctx.strokeStyle = "white";
//   //   this.ctx.fillStyle = "white";
//   // }
// }
