import MazeGenerator from ".";
import MazeTexture from "..";
import Utils from "../../Utils";
import Cell from "./cell";

namespace Algorithms {
  export function recursiveBacktracker(maze: MazeGenerator) {
    const stack = [maze.startingCell];

    while (stack.length) {
      const current = Utils.last(stack);
      const unvisitedNeighbors = current.unVisitedNeighbours;
      if (unvisitedNeighbors.length == 0) stack.pop();
      else {
        const neighbor = Phaser.Utils.Array.GetRandom(unvisitedNeighbors);
        current.linkTo(neighbor);
        stack.push(neighbor);

        // debug
        // maze.lineBetween(
        //   current.center.x,
        //   current.center.y,
        //   neighbor.center.x,
        //   neighbor.center.y
        // );
      }
    }
  }
}

export default Algorithms;
