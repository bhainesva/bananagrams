import React, { Component } from 'react';

import FlipMove from 'react-flip-move';
import Toggle from './Toggle';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';

import './Scrabble.scss';

const tiles = [
  { id: 1, letter: 'F', points: 4, x: 1, y: 3 },
  { id: 2, letter: 'L', points: 2, x: 2, y: 3 },
  { id: 3, letter: 'I', points: 1, x: 3, y: 3 },
  { id: 4, letter: 'P', points: 2, x: 4, y: 3 },
  { id: 5, letter: 'M', points: 6, x: 6, y: 3 },
  { id: 6, letter: 'O', points: 1, x: 7, y: 3 },
  { id: 7, letter: 'V', points: 8, x: 8, y: 3 },
  { id: 8, letter: 'E', points: 2, x: 9, y: 3 }
]

const BOARD_WIDTH = 11;
const BOARD_HEIGHT = 7;
const SQUARE_SIZE = 56;
const TILE_OFFSET = 3;
const NUM_SQUARES = BOARD_WIDTH * BOARD_HEIGHT;

export default class Scrabble extends Component {
  constructor(props) {
    super(props);
    this.state = { tiles }

    this.updateDroppedTilePosition = this.updateDroppedTilePosition.bind(this);
    this.resetTiles = this.resetTiles.bind(this);
  }

  updateDroppedTilePosition({x, y}, tile) {
    const stateTiles = this.state.tiles.slice();
    const index = stateTiles.findIndex(stateTile => stateTile.id === tile.id);

    stateTiles[index] = { ...tiles, x, y };

    this.setState({ tiles: stateTiles });
  }

  resetTiles() {
    this.setState({ tiles });
  }

  renderTiles() {
    return this.state.tiles.map((tile, index) => {
      return (
        <Tile
          key={index}
          onDrop={this.updateDroppedTilePosition}
          {...tile}
        />
      );
    });
  }

  renderBoardSquares() {
    const matrix = indexMatrix(BOARD_WIDTH, BOARD_HEIGHT);

    return matrix.map((row, rowIndex) => {
      row.map(index => {
        return (
          <BoardSquare
            x={index}
            y={rowIndex}
            onDrop={this.updateDroppedTilePosition}
          />
        );
      });
    });
  }

  render() {
    return (
      <DndProvider backend={Backend}>
        <div id="scrabble">
          <div className="board-border">
            <div className="board">
              <FlipMove duration={200} staggerDelayBy={150}>
                {this.renderTiles()}
              </FlipMove>
              {this.renderBoardSquares()}
            </div>
          </div>

          <div className="controls">
            <Toggle
              clickHandler={this.resetTiles}
              text="Reset" icon="refresh"
              active={true}
              large={true}
            />
          </div>
        </div>
      </DndProvider>
    );
  }
}

const indexMatrix = (r, c) => range(r).map(() => range(c).slice());
const range = (n) => Array.from(new Array(n), (x, i) => i);

class Tile extends Component {
  render() {
    const { letter, points, x, y} = this.props;

    const styles = {
      left: x * SQUARE_SIZE - TILE_OFFSET,
      top: y * SQUARE_SIZE - TILE_OFFSET,
      zIndex: `${x+1}${y+1}`,
      opacity: 1,
    };

    return (
      <div className="tile" style={styles}>
        <span className="tile-letter">{letter}</span>
        <span className="tile-points">{points}</span>
      </div>
    )
  }
}

class BoardSquare extends Component {
  renderSquare() {
    return <div className="board-square"></div>
  }

  render() {
    if (this.props.tile) {
      return this.renderSquare();
    } else {
      return this.renderSquare();
    }
  }
}