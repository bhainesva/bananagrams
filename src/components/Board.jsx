import React from 'react';

import BoardTile from './BoardTile';
import EmptySpace from './EmptySpace';

import './Board.scss';

const TILE_SIZE = 50;

function cantorPairing(a, b) {
  return (0.5) * (a + b) * (a + b + 1) + b;
}

function pointsEqual(a, b) {
  return a.r === b.r && a.c === b.c;
}

export default function Board(props) {

  const squares = [];
  for (let r = 0; r < props.size; r++) {
    for (let c = 0; c < props.size; c++) {
      const isSelected = props.selectedCell
        ? pointsEqual(props.selectedCell, { r, c })
        : false;

      squares.push(
        <EmptySpace
          r={r}
          c={c}
          selected={isSelected}
          direction={props.selectedDirection}
          onClick={() => props.onEmptySquareClick({r, c})}
          onDrop={props.onTileDrop}
          key={r * props.size + c}
        />
      );
    }
  }

  const tileSquares = props.tiles.flatMap((row, r) => row.map((letter, c) => {
    return (
      letter
      ? <BoardTile
          letter={letter}
          r={r}
          c={c}
          onClick={() => props.onEmptySquareClick({r, c})}
          key={cantorPairing(r, c)}
          onDrop={props.onTileDrop}
        />
      : null
    )
  }));

  return (
    <div className="Board"
      style={{
        display: 'grid',
        gridTemplate: `repeat(${props.size}, ${TILE_SIZE}px) / repeat(${props.size}, ${TILE_SIZE}px)`,
      }}
    >
      {squares}
      {tileSquares}
    </div>
  )
}