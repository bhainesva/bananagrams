import React, { useState, useEffect } from 'react';

import BoardTile from './BoardTile';
import EmptySpace from './EmptySpace';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import Draggable from 'react-draggable';

import Maybe from 'sanctuary-maybe';
import Nothing from 'sanctuary-maybe';

import { Pad } from 'react-pannable';

import './Board.scss';

const TILE_SIZE = 50;

function cantorPairing(a, b) {
  return (0.5) * (a + b) * (a + b + 1) + b;
}

function just(maybe) {
  if (maybe.isNothing) throw Error("Tried to access value of Nothing.");

  return maybe.value;
}

function orElse(def, maybe) {
  return maybe.isJust
    ? maybe.value
    : def;
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
          onDrop={() => console.log("Tile was dropped on square")}
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
          key={cantorPairing(r, c)}
          onDrop={() => console.log("tile was dropped on tile")}
        />
      : null
    )
  }));

  return (
    <div onScroll={console.log}>
      <DndProvider backend={Backend}>
        <div className="Board"
          style={{
            display: 'grid',
            gridTemplate: `repeat(${props.size}, ${TILE_SIZE}px) / repeat(${props.size}, ${TILE_SIZE}px)`,
          }}
        >
          {squares}
          {tileSquares}
        </div>
      </DndProvider>
    </div>
  )
}