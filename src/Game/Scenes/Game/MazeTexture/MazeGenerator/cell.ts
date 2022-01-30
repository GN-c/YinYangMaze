import { PolarCoordinate } from "../../Dot";
import Utils from "../../Utils";

export default class Cell {
  links = new Set<Cell>();
  neighbours: {
    inner: Cell | undefined;
    right: Cell;
    outer: Cell[];
    left: Cell;
  };
  centerPolarCoordinate: PolarCoordinate;
  centerCoordinate: { x: number; y: number };

  constructor(
    public angle: [start: number, end: number],
    public radius: [inner: number, outer: number]
  ) {
    this.centerPolarCoordinate = {
      radius: Utils.average(radius),
      angle: Utils.average(angle),
    };
    this.centerCoordinate = {
      x:
        Math.cos(this.centerPolarCoordinate.angle) *
        this.centerPolarCoordinate.radius,
      y:
        Math.sin(this.centerPolarCoordinate.angle) *
        this.centerPolarCoordinate.radius,
    };
  }

  setAngle(angle: [start: number, end: number]) {
    this.angle = angle;
  }

  setRadius(radius: [inner: number, outer: number]) {
    this.radius = radius;
  }

  setNeighbours(
    inner: Cell | undefined,
    right: Cell,
    outer: Cell[],
    left: Cell
  ) {
    this.neighbours = { inner, right, outer, left };
  }

  updateNeightbour<dir extends keyof Cell["neighbours"]>(
    direction: dir,
    cells: Cell["neighbours"][dir]
  ) {
    this.neighbours[direction] = cells;
  }

  linkTo(cell: Cell, bi: boolean = true) {
    this.links.add(cell);
    if (bi) cell.linkTo(this, false);
  }

  unLinkTo(cell: Cell, bi: boolean = true) {
    this.links.delete(cell);
    if (bi) cell.unLinkTo(this, false);
  }

  isLinkedTo(cell: Cell | undefined) {
    return cell && this.links.has(cell);
  }

  get isUnVisited() {
    return this.links.size === 0;
  }

  get unVisitedNeighbours() {
    return Object.values(this.neighbours)
      .flat()
      .filter((cell) => cell !== undefined && cell.isUnVisited);
  }

  reset() {
    //@ts-ignore
    this.neighbours = undefined;
    this.links.clear();
  }
}
