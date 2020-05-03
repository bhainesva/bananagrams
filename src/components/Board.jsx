import React, { useState } from 'react';

import Tile from './Tile';
import BoardSquare from './BoardSquare';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';

import './Board.scss';

const initialTiles = [
  {id: 1, x: 0, y: 0, letter: 'A'},
  {id: 2, x: 1, y: 0, letter: 'B'},
  {id: 3, x: 2, y: 0, letter: 'C'},
  {id: 4, x: 3, y: 0, letter: 'D'},
  {id: 5, x: 0, y: 2, letter: 'E'},
  {id: 6, x: 1, y: 3, letter: 'F'},
]

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 10;

function updateDroppedTilePosition(tiles, {x, y}, tile) {
  const stateTiles = tiles.slice();
  const index = stateTiles.findIndex(stateTile => stateTile.id === tile.id);

  stateTiles[index] = { ...tile, x, y };
  console.log("updated state: ", stateTiles);
  return stateTiles;
}

function getTileById(tiles, id) {
  return tiles.filter(tile => tile.id === id)[0];
}

function tileAt(tiles, {x, y}) {
  for (const tile of tiles) {
    if (tile.x === x && tile.y === y) return true;
  }

  return false;
}

export default function Board(props) {
  const [tiles, setTiles] = useState(initialTiles);

  const squares = [];
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      if (!tileAt(tiles, {x, y})) {
        squares.push(
          <BoardSquare
            x={x}
            y={y}
            onDrop={(tileId, {x, y}) => setTiles(tiles => {
              const tile = getTileById(tiles, tileId);
              return updateDroppedTilePosition(tiles, {x, y}, tile);
            })}
            key={y * BOARD_WIDTH + x}
          />
        );
      }
    }
  }

  const tileSquares = tiles.map(({id, x, y, letter}, i) => {
    return (
      <Tile
        x={x}
        y={y}
        key={i}
        id={id}
        onDrop={(id1, id2) => setTiles((tiles) => {
          const tile1 = getTileById(tiles, id1);
          const tile2 = getTileById(tiles, id2);
          const intermediateState = updateDroppedTilePosition(tiles, tile1, tile2);
          return updateDroppedTilePosition(intermediateState, tile2, tile1)
        })}
      >{letter}</Tile>
    )
  });

  return (
      <DndProvider backend={Backend}>
        <div className="Board"
          style={{
            display: 'grid',
            gridTemplate: `repeat(${BOARD_HEIGHT}, 1fr) / repeat(${BOARD_WIDTH}, 1fr)`,
          }}
        >
          {squares}
          {tileSquares}
        </div>
      </DndProvider>
  )
}