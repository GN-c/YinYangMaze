import Utils from "../../Utils";
import Algorithms from "./algorithm";
import Cell from "./cell";

/**
 * Class For Generating Mazes
 * Reusability in mind, for generating new maze, even with different dimensions call generate
 */
export default class MazeGenerator {
  private pathWidth: number;
  private complexity: number;

  private polarGrid: Cell[][] = [];
  public startingCell: Cell;
  centerCell: Cell;

  generate(pathWidth: number, complexity: number) {
    this.pathWidth = pathWidth;
    this.complexity = complexity;
    this.reset();

    /**
     * Populate grid with cells
     */
    Utils.times(this.complexity - this.polarGrid.length, () =>
      this.addPolarRow()
    );
    /** Configurate cells - define neighbours */
    this.configCells();
    /**
     * Find Starting Cell
     */
    this.startingCell = Phaser.Utils.Array.GetRandom(
      Utils.last(this.polarGrid)
    );
    this.centerCell = this.polarGrid[0][0];
    // this.startingCell = this.polarGrid[3][4];
    /**
     * Run Algorithm
     */
    Algorithms.recursiveBacktracker(this);
    console.log(this.polarGrid);
  }

  private addPolarRow() {
    /**
     * Index of this row
     */
    const index = this.polarGrid.length;
    const innerPolarRow: Cell[] | undefined = Utils.last(this.polarGrid);

    /**
     * Amount of cells in this row
     */
    const nOfCells =
      index == 0
        ? 1
        : Phaser.Math.Snap.Floor(
            Utils.TWO_PI / (2 * Math.asin(1 / (2 * index))),
            innerPolarRow.length
          );

    /**
     * Create row of cells
     */
    const polarRow = Utils.timesMap(nOfCells, (c) => {
      return new Cell(
        [
          (c / nOfCells) * Utils.TWO_PI - Math.PI,
          ((c + 1) / nOfCells) * Utils.TWO_PI - Math.PI,
        ],
        [index * this.pathWidth, (index + 1) * this.pathWidth]
      );
    });

    /** Add to grid */
    this.polarGrid.push(polarRow);
  }

  private configCells() {
    for (let rowIndex = 0; rowIndex < this.polarGrid.length; rowIndex++) {
      const innerRow = this.polarGrid[rowIndex - 1];
      const row = this.polarGrid[rowIndex];
      const outerRow = this.polarGrid[rowIndex + 1];
      const ratio = outerRow && outerRow.length / row.length;
      for (let cellIndex = 0; cellIndex < row.length; cellIndex++) {
        const cell = row[cellIndex];
        cell.setNeighbours(
          innerRow
            ? innerRow[Math.floor((cellIndex / row.length) * innerRow.length)]
            : undefined,
          Utils.pick(row, cellIndex - 1),
          outerRow
            ? outerRow.slice(cellIndex * ratio, (cellIndex + 1) * ratio)
            : [],
          Utils.pick(row, cellIndex + 1)
        );
      }
    }
  }

  private removePolarRow() {
    /**
     * Remove last row
     */
    this.polarGrid.pop();
    /**
     * Remove references to cells in outer row as neighbours
     */
    Utils.last(this.polarGrid).forEach((cell) =>
      cell.updateNeightbour("outer", [])
    );
  }

  public forEachCell(callback: (cell: Cell) => void) {
    Utils.iterate<Cell>(this.polarGrid, (cell) => callback(cell));
  }

  private reset() {
    this.forEachCell((cell) => cell.reset());
  }
}
