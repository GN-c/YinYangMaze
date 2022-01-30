import Utils from "../Utils";
import MazeGenerator from "./MazeGenerator";
import Cell from "./MazeGenerator/cell";

interface MazeTextureStyle {
  lineWidth: number;
}

/**
 * Procedurally Generates Maze,Renders and Adds to Texture manager with key `MAZE`
 */
export default class MazeTexture {
  static readonly TEXTURE_KEY = "MAZE";
  private size: number;
  private offset: number;
  private pathWidth: number;
  private complexity: number;

  constructor(
    private readonly scene: Phaser.Scene,
    private style: MazeTextureStyle
  ) {
    this.createTexture().createGenerator();
  }

  private generator: MazeGenerator;
  private createGenerator() {
    this.generator = new MazeGenerator();

    return this;
  }

  private texture: Phaser.Textures.CanvasTexture;
  private ctx: CanvasRenderingContext2D;
  private createTexture() {
    /**
     * Creating 2D canvas as texture
     * We're using 2D canvas because drawing arcs on 2DRenderingContext is much performance friendly and smoother than on webgl
     * this texture will be uploaded on GPU afterwards
     */
    this.texture = this.scene.textures.createCanvas(
      MazeTexture.TEXTURE_KEY,
      100,
      100
    );
    this.ctx = this.texture.getContext();

    return this;
  }

  generate(pathWidth: number, complexity: number) {
    /**
     * Update Properties
     */
    this.pathWidth = pathWidth;
    this.complexity = complexity;
    this.size = 2 * this.complexity * this.pathWidth + this.style.lineWidth;
    this.offset = this.size / 2;

    /**
     * Check if it's same size, we don't need to resize the texture
     */
    if (this.texture.width !== this.size || this.texture.height !== this.size)
      this.texture.setSize(this.size, this.size);

    /** Generate new maze */
    this.generator.generate(this.pathWidth, this.complexity);

    /**
     * Render to texture
     */
    this.render();

    /**
     * Update Texture
     */
    this.texture.refresh();
  }

  get startingCell() {
    return this.generator.startingCell;
  }

  get centerCell() {
    return this.generator.centerCell;
  }

  private render() {
    /**
     * Reset transform, Clear and translate canvas to the center
     */
    this.ctx.resetTransform();
    this.ctx.clearRect(0, 0, this.size, this.size);
    this.ctx.translate(this.offset, this.offset);
    this.setStyle();
    this.generator.forEachCell((cell) => this.drawCell(cell));
  }

  private drawCell(cell: Cell) {
    if (
      !cell.neighbours.inner ||
      (cell.neighbours.inner && !cell.isLinkedTo(cell.neighbours.inner))
    )
      this.drawArc(cell.radius[0], cell.angle);

    this.ctx.beginPath();
    this.ctx.arc(
      cell.centerCoordinate.x,
      cell.centerCoordinate.y,
      5,
      0,
      Utils.TWO_PI
    );
    this.ctx.fill();

    if (!cell.isLinkedTo(cell.neighbours.left) && cell !== cell.neighbours.left)
      this.drawPolarLine(cell.angle[1], cell.radius);

    if (!cell.neighbours.outer || cell.neighbours.outer.length === 0)
      this.drawArc(cell.radius[1], cell.angle);
  }

  private drawArc(radius: number, angle: [start: number, end: number]) {
    this.ctx.beginPath();
    this.ctx.arc(0, 0, radius, angle[0], angle[1]);
    this.ctx.stroke();
  }

  private drawPolarLine(angle: number, radius: [start: number, end: number]) {
    const cos = Math.cos(angle),
      sin = Math.sin(angle);

    this.ctx.beginPath();
    this.ctx.moveTo(cos * radius[0], sin * radius[0]);
    this.ctx.lineTo(cos * radius[1], sin * radius[1]);
    this.ctx.stroke();
  }

  private setStyle() {
    /**
     * Set Style
     */
    this.ctx.lineCap = "round";
    this.ctx.lineWidth = this.style.lineWidth;
    this.ctx.strokeStyle = "white";
    this.ctx.fillStyle = "white";
  }
}
