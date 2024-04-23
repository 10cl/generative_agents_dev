/**
 * This experimental project was created to explore `cellular automaton`,
 * originally discovered in the 1940s by Stanislaw Ulam and John von Neumann.
 *
 * A cellular automaton is a `discrete model`, that consists of a `grid of cells`
 * (can be in any finite number of dimensions).
 * Each cell is in `one of a finite number of states`. The simplest example has
 * two possibilities of 1 and 0 (“on” and “off” or “alive” and “dead”).
 *
 * Every cell defines a set of cells called its `neighborhood`.
 *
 * At start an initial state (t = 0) is selected by assigning a state for each cell.
 * New generation are created (t = t + 1) according to some fixed rule
 * (f.e. a mathematical function) that determine the new state of a cell in terms
 * of the current state of the cell and the states of the cells in its neighborhood.
 * Typically, the rule for updating the state of cells is the same for each cell
 * and does not change over time, and is applied to the whole grid simultaneously.
 * Exceptions are: The stochastic cellular automaton and asynchronous cellular automaton.
 *
 * Cellular automata can simulate a variety of real-world systems, including
 * biological and chemical ones. Von Neumann’s work in self-replication and
 * cellular automaton is conceptually similar to what is probably the most famous
 * cellular automaton: the "Game of Life".
 *
 * Ressources:
 * [1] [Wikipedia](https://en.wikipedia.org/wiki/Cellular_automaton)
 * [2] [Nature Of Code](http://natureofcode.com/book/chapter-7-cellular-automata)
 * [3] [Stephen Wolfram’s 1,280-page A New Kind of Science](http://www.wolframscience.com/nks)
 */
import Phaser from "phaser";
import Maze from "../objects/maze";
import {loadLongMemory} from "../helpers/memory";
import {updatePointerStatus} from "../helpers/pointer";
import {DevScene} from "./dev";

export class GenerativeAgentsDevScene extends DevScene {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  preload(): void {
    console.log("preload")
    this.load.pack('preload', './assets/pack.json', 'preload');
  }

  create(): void{
    console.log("create")

    this.maze = new Maze()
    this.maze.initMap(this, "GenerativeAgentsDevMap")
    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.removeCapture(Phaser.Input.Keyboard.KeyCodes.SPACE)

    this.maze.preloadNpcSprites(this);
    loadLongMemory().then(movement => {
      this.all_movement = movement
    })

  }

  init(): void {
    console.log("init")
    // Init grid instance
  }

  update() {
    console.log("update")
    updatePointerStatus(this)

  }

}
