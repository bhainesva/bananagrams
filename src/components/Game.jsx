import React, { useState, useEffect } from 'react';

import { remove, always, contains, indexOf } from 'ramda';

import Board from './Board';
import Staging from './Staging';

const initialBag = [
  ...Array(13).fill('a'),
  ...Array(3).fill('b'),
  ...Array(3).fill('c'),
  ...Array(6).fill('d'),
  ...Array(18).fill('e'),
  ...Array(3).fill('f'),
  ...Array(4).fill('g'),
  ...Array(3).fill('h'),
  ...Array(12).fill('i'),
  ...Array(2).fill('j'),
  ...Array(2).fill('k'),
  ...Array(5).fill('l'),
  ...Array(3).fill('m'),
  ...Array(8).fill('n'),
  ...Array(11).fill('o'),
  ...Array(3).fill('p'),
  ...Array(2).fill('q'),
  ...Array(9).fill('r'),
  ...Array(6).fill('s'),
  ...Array(9).fill('t'),
  ...Array(6).fill('u'),
  ...Array(3).fill('v'),
  ...Array(3).fill('w'),
  ...Array(2).fill('x'),
  ...Array(3).fill('y'),
  ...Array(2).fill('z'),
];

const BOARD_SIZE = 15;

function select1(list) {
  const index = Math.floor(Math.random() * list.length);
  return {value: list[index], remaining: remove(index, 1, list)}
}

function selectX(list, x) {
  const selections = [];
  let selectionList = list;

  for (let i = 0; i < x; i++) {
    const {value, remaining} = select1(selectionList);
    selections.push(value);
    selectionList = remaining;
  }

  return {values: selections, remaining: selectionList};
}

function insertLetter(board, {r, c}, letter) {
  const clone = board.map(row => row.slice());
  clone[r][c] = letter;
  return clone;
}

function boardIsEmpty(board) {
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (board[r][c]) return false;
    }
  }

  return true;
}

const initialTiles =
  Array.from({length: BOARD_SIZE}).map(() =>
    Array.from({length: BOARD_SIZE}).map(
      always('')));


function pointsEqual(a, b) {
  return a.r === b.r && a.c === b.c;
}

function adjacent({r, c}, direction) {
  return direction === 'right'
    ? {r, c: c+1}
    : direction === 'down'
      ? {r: r+1, c}
      : {r, c}
}

function nextSelectedSpace(board, {r, c}, direction) {
  const nextSpace = adjacent({r, c}, direction);
  return (nextSpace.r < board.length && nextSpace.c < board[nextSpace.r].length)
    ? nextSpace
    : null;
}

export default function Game() {
  const [{ board, bag, staging }, setState] = useState({board: initialTiles, bag: initialBag, staging: []})
  const [{selectedCell, selectedDirection}, setSelected] = useState({selectedCell: null, selectedDirection: null});

  console.log("selected cell: ", selectedCell);
  useEffect(() => {
    const listener =  (e) => {
      if (contains(e.key, staging)) {
        setState({
          board: insertLetter(board, selectedCell, e.key),
          bag: bag,
          staging: remove(indexOf(e.key, staging), 1, staging),
        });
        setSelected({
          selectedCell: nextSelectedSpace(board, selectedCell, selectedDirection),
          selectedDirection: selectedDirection,
        });
      }
    }

    window.addEventListener('keypress', listener);

    return () => window.removeEventListener('keypress', listener);
  }, [selectedCell]);

  function onEmptySquareClick(point) {
    if (!selectedCell || !pointsEqual(point, selectedCell)) {
      setSelected({
        selectedCell: (point),
        selectedDirection: 'right',
      })
    } else {
      console.log("clicked same cell")
      console.log(selectedDirection == 'right' ? 'down' : null)
      setSelected({
        selectedCell: selectedDirection == 'right' ? point : null,
        selectedDirection: selectedDirection == 'right' ? 'down' : null,
      })
    }
  }

  const drawTiles = (n) => {
    const { values, remaining } = selectX(bag, n);

    setState((prevState) => ({
      ...prevState,
      bag: remaining,
      staging: [...prevState.staging, ...values]
    }));
  }

  const empty = boardIsEmpty(board) && staging.length === 0;

  return (
    <div>
      <div style={{
        display: 'flex',
      }}>
        <Board
          size={BOARD_SIZE}
          selectedCell={selectedCell}
          selectedDirection={selectedDirection}
          onEmptySquareClick={onEmptySquareClick}
          tiles={board} />
        <Staging letters={staging} />
      </div>
      {empty && <button onClick={() => drawTiles(21)}>DRAW TILES</button>}
      <br />
      {!empty && <button onClick={() => drawTiles(1)}>PEEL</button>}
    </div>
  )
}