import React, { useState, useEffect } from 'react';

import { remove, always, contains, append, indexOf } from 'ramda';

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
    : direction === 'left'
      ? {r, c: c-1}
    : direction === 'up'
     ? {r: r-1, c}
    : {r, c}
}

function oppositeDirection(direction) {
  switch(direction) {
    case 'left':
      return 'right'
    case 'right':
      return 'left'
    case 'down':
      return 'up'
    case 'up':
      return 'down'
    default:
      return 'left'
  }
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
      } else {
        if (e.key === 'ArrowDown') {
          setSelected(({selectedCell, selectedDirection}) => ({
            selectedCell: selectedDirection === 'down' ? nextSelectedSpace(board, selectedCell, 'down') : selectedCell,
            selectedDirection: 'down',
          }))
        } else if (e.key === 'ArrowLeft') {
          setSelected(({selectedCell, selectedDirection}) => ({
            selectedCell: nextSelectedSpace(board, selectedCell, 'left'),
            selectedDirection: selectedDirection,
          }))
        } else if (e.key === 'ArrowRight') {
          setSelected(({selectedCell, selectedDirection}) => ({
            selectedCell: selectedDirection === 'right' ? nextSelectedSpace(board, selectedCell, 'right') : selectedCell,
            selectedDirection: 'right',
          }))
        } else if (e.key === 'ArrowUp') {
          setSelected(({selectedCell, selectedDirection}) => ({
            selectedCell: nextSelectedSpace(board, selectedCell, 'up'),
            selectedDirection: selectedDirection,
          }))
        } else if (e.key === 'Backspace') {
          e.preventDefault();
          setState(({bag, board, staging}) => ({
            board: insertLetter(board, selectedCell, ''),
            staging: board[selectedCell.r][selectedCell.c] !== '' ? append(board[selectedCell.r][selectedCell.c], staging) : staging,
            bag: bag,
          }))
          setSelected(({selectedCell, selectedDirection}) => ({
            selectedCell: nextSelectedSpace(board, selectedCell, oppositeDirection(selectedDirection)),
            selectedDirection: selectedDirection,
          }))
        }
      }
    }

    window.addEventListener('keydown', listener);

    return () => window.removeEventListener('keydown', listener);
  }, [selectedCell, bag, board, staging, selectedDirection]);

  function onEmptySquareClick(point) {
    if (!selectedCell || !pointsEqual(point, selectedCell)) {
      setSelected({
        selectedCell: (point),
        selectedDirection: 'right',
      })
    } else {
      setSelected({
        selectedCell: selectedDirection === 'right' ? point : null,
        selectedDirection: selectedDirection === 'right' ? 'down' : null,
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