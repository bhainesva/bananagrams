import React, { useMemo } from 'react';

import BoardTile from './BoardTile';
import EmptySpace from './EmptySpace';

import './Board.scss';

const TILE_SIZE = 50;

function cantorPairing(a, b) {
  return (0.5) * (a + b) * (a + b + 1) + b;
}

export default function Board(props) {
  const selectedCell = props.selectedCell;

  const squares = [];
  for (let r = 0; r < props.size; r++) {
    for (let c = 0; c < props.size; c++) {
      const isSelected = selectedCell
        ? selectedCell.r === r && selectedCell.c === c
        : false;


      squares.push(
        <EmptySpace
          r={r}
          c={c}
          selected={isSelected}
          direction={props.selectedDirection}
          handleClick={isSelected ? props.onSelectedSquareClick : props.handleUnselectedCellClick}
          onDrop={props.onTileDrop}
          key={r * props.size + c}
        />
      );
    }
  }

  const tileSquares = props.tiles.flatMap((row, r) => row.map((letter, c) => {
    const isSelected = selectedCell
      ? selectedCell.r === r && selectedCell.c === c
      : false;

    return (
      letter
      ? <BoardTile
          letter={letter}
          r={r}
          c={c}
          handleClick={isSelected ? props.onSelectedSquareClick : props.handleUnselectedCellClick}
          key={r * props.size + c}
          onDrop={props.onTileDrop}
        />
      : null
    )
  }));

  const styles = useMemo(() => ({
    display: 'grid',
    gridTemplate: `repeat(${props.size}, ${TILE_SIZE}px) / repeat(${props.size}, ${TILE_SIZE}px)`,
  }), [props.size]);

  return (
    <div className="Board"
      style={styles}
    >
      {squares}
      {tileSquares}
    </div>
  )
}