import GameScene from "..";
import Cell from "../MazeTexture/MazeGenerator/cell";
import Utils from "../Utils";

interface Props {
  keys: {
    [key in "inward" | "right" | "outward" | "left"]: number;
  };
  color: number;
}

export type PolarCoordinate = { radius: number; angle: number };

export default class Dot extends Phaser.GameObjects.Arc {
  static readonly RADIUS = 52.5;
  keys: {
    [key in "inward" | "right" | "outward" | "left"]: Phaser.Input.Keyboard.Key;
  };
  cell: Cell;

  constructor(
    public scene: GameScene,
    private startingCell: Cell,
    private readonly props: Props
  ) {
    super(scene, 0, 0, Dot.RADIUS, 0, 360, false, props.color);
    this.addToScene()
      .setOrigin(0.5)
      .setFromPolarCoordinates(this.startingCell.centerPolarCoordinate)
      .createControls();

    this.cell = startingCell;
  }

  createControls() {
    this.keys = this.scene.input.keyboard.addKeys(this.props.keys) as any;
    this.keys.inward.on(Phaser.Input.Keyboard.Events.DOWN, async () => {
      if (this.isMoving) return;
      const targetCell = this.cell.neighbours.inner;
      if (!targetCell || !this.cell.isLinkedTo(targetCell)) return;

      if (targetCell === this.scene.MazeTexture.centerCell) {
        await this.moveTo({
          angle: this.cell.centerPolarCoordinate.angle,
          radius: 0,
        });
      } else if (targetCell.neighbours.outer.length == 2) {
        await this.moveTo({
          angle: this.cell.centerPolarCoordinate.angle,
          radius: targetCell!.centerPolarCoordinate.radius,
        });
      } else {
        await this.moveTo(targetCell.centerPolarCoordinate);
      }
      this.cell = targetCell!;
    });
    this.keys.right.on(Phaser.Input.Keyboard.Events.DOWN, async () => {
      if (this.isMoving) return;
      if (
        this.cell.neighbours.outer.length === 2 &&
        Phaser.Math.Fuzzy.Equal(
          this.cell.neighbours.outer[1].centerPolarCoordinate.angle,
          this.polarCoordinates.angle
        )
      ) {
        this.moveTo({
          angle: this.cell.neighbours.outer[0].centerPolarCoordinate.angle,
          radius: this.cell.centerPolarCoordinate.radius,
        });
      } else {
        const targetCell = this.cell.neighbours.right;
        if (!this.cell.isLinkedTo(targetCell)) return;

        if (targetCell.neighbours.outer.length === 2) {
          this.moveTo({
            angle: targetCell.neighbours.outer[1].centerPolarCoordinate.angle,
            radius: this.cell.centerPolarCoordinate.radius,
          });
        } else {
          await this.moveTo(targetCell!.centerPolarCoordinate);
        }

        this.cell = targetCell;
      }
    });
    this.keys.outward.on(Phaser.Input.Keyboard.Events.DOWN, async () => {
      if (this.isMoving) return;

      const targetCell = this.cell.neighbours.outer.find((cell) =>
        Phaser.Math.Fuzzy.Equal(
          cell.centerPolarCoordinate.angle,
          this.polarCoordinates.angle
        )
      );
      if (!targetCell || !this.cell.isLinkedTo(targetCell)) return;

      if (targetCell.neighbours.outer.length === 2) {
        this.moveTo({
          angle: targetCell.neighbours.outer[1].centerPolarCoordinate.angle,
          radius: targetCell.centerPolarCoordinate.radius,
        });
      } else {
        await this.moveTo(targetCell!.centerPolarCoordinate);
      }

      this.cell = targetCell!;
    });
    this.keys.left.on(Phaser.Input.Keyboard.Events.DOWN, async () => {
      if (this.isMoving) return;
      if (
        this.cell.neighbours.outer.length === 2 &&
        Phaser.Math.Fuzzy.Equal(
          this.cell.neighbours.outer[0].centerPolarCoordinate.angle,
          this.polarCoordinates.angle
        )
      ) {
        this.moveTo({
          angle: this.cell.neighbours.outer[1].centerPolarCoordinate.angle,
          radius: this.cell.centerPolarCoordinate.radius,
        });
      } else {
        const targetCell = this.cell.neighbours.left;
        if (!this.cell.isLinkedTo(targetCell)) return;

        if (targetCell.neighbours.outer.length === 2) {
          this.moveTo({
            angle: targetCell.neighbours.outer[0].centerPolarCoordinate.angle,
            radius: this.cell.centerPolarCoordinate.radius,
          });
        } else {
          await this.moveTo(targetCell!.centerPolarCoordinate);
        }

        this.cell = targetCell;
      }
    });
  }

  isMoving: boolean = false;
  async moveTo({ radius, angle }: PolarCoordinate) {
    const polarCoordinates = this.polarCoordinates;

    const deltaR = radius - polarCoordinates.radius;
    const deltaA = Utils.shortestAngle(polarCoordinates.angle, angle);

    return new Promise<void>((onComplete) =>
      this.scene.tweens.addCounter({
        from: 0,
        to: 1,
        duration: 200,
        onStart: () => (this.isMoving = true),
        onUpdate: (tween) => {
          const progress = tween.progress;
          this.setFromPolarCoordinates({
            radius: polarCoordinates.radius + progress * deltaR,
            angle: polarCoordinates.angle + progress * deltaA,
          });
        },
        onComplete: () => {
          this.isMoving = false;
          onComplete();
        },
      })
    );
  }

  setFromPolarCoordinates({ radius, angle }: PolarCoordinate) {
    this.x = Math.cos(angle) * radius + this.scene.center.x;
    this.y = Math.sin(angle) * radius + this.scene.center.y;

    return this;
  }

  get polarCoordinates(): PolarCoordinate {
    return {
      radius: Phaser.Math.Distance.Between(
        this.x,
        this.y,
        this.scene.center.x,
        this.scene.center.y
      ),
      angle: Phaser.Math.Angle.Between(
        this.scene.center.x,
        this.scene.center.y,
        this.x,
        this.y
      ),
    };
  }

  setCell(cell: Cell) {
    this.cell = cell;
    this.setFromPolarCoordinates(cell.centerPolarCoordinate);
  }

  updatePosition() {
    this.setFromPolarCoordinates(this.cell.centerPolarCoordinate);
  }

  private addToScene() {
    this.scene.add.existing(this);

    return this;
  }
}
