import React, { useState, useEffect, useMemo } from 'react';

import { curry, remove, always, contains, append, indexOf } from 'ramda';

import Draggable from 'react-draggable';

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

const smallBag = [
  ...Array(4).fill('a'),
  ...Array(2).fill('b'),
  ...Array(2).fill('c'),
  ...Array(2).fill('d'),
  ...Array(4).fill('e'),
  ...Array(2).fill('f'),
  ...Array(2).fill('g'),
];

const BOARD_SIZE = 30;

function select1(list) {
  const index = Math.floor(Math.random() * list.length);
  console.log("list length: ", list.length);
  const values = list.length ? [list[index]] : [];
  return {values, remaining: remove(index, 1, list)}
}

function selectX(list, x) {
  console.log("selecting from :" , list)
  let selections = [];
  let selectionList = list;

  for (let i = 0; i < x; i++) {
    const {values, remaining} = select1(selectionList);
    console.log("select 1: ", values);
    selections = [...selections, ...values];
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

function tilesOnBoard(board) {
  return board.reduce((acc, row) => {
    return acc + row.reduce((acc2, letter) => {
      return acc2 + (letter === '' ? 0 : 1)
    }, 0)
  }, 0)
}


function getNeighbors({r, c}) {
  return [
    {r: r+1, c},
    {r: r-1, c},
    {r, c: c+1},
    {r, c: c-1},
  ]
}

const inBounds = curry((board, {r, c}) => {
  return 0 <= r && r < board.length && 0 <= c && c < board[r].length;
});

function firstOccupiedSquare(board) {
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (board[r][c]) return {r, c}
    }
  }
}

function tilesConnected(board) {
  if (boardIsEmpty(board)) return true;
  const totalTiles = tilesOnBoard(board);
  const {r, c} = firstOccupiedSquare(board);
  const seen = new Set();
  let stack = [{r, c}];
  let count = 0;

  while (stack.length) {
    const current = stack.pop();
    seen.add(`${current.r},${current.c}`);
    count += 1;
    const n = getNeighbors(current)
      .filter(inBounds(board))
      .filter(({r, c}) => !!board[r][c])
      .filter(({r, c}) => !seen.has(`${r},${c}`))
    stack = [...stack, ...n];
  }

  return totalTiles === count;
}

const initialTiles =
  Array.from({length: BOARD_SIZE}).map(() =>
    Array.from({length: BOARD_SIZE}).map(
      always('')));
initialTiles[Math.floor(BOARD_SIZE/2)][Math.floor(BOARD_SIZE/2)] = 'z';


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
    : {r, c};
}

export default function Game() {
  const [{ board, bag, staging }, setState] = useState({board: initialTiles, bag: smallBag, staging: []})
  const [{selectedCell, selectedDirection}, setSelected] = useState({selectedCell: null, selectedDirection: null});
  const [spacebarPressed, setSpacebarPressed] = useState(false);

  useEffect(() => {
    const listener =  (e) => {
      if (contains(e.key, staging)) {
        setState(({board, bag, staging}) => ({
          board: insertLetter(board, selectedCell, e.key),
          bag: bag,
          staging: board[selectedCell.r][selectedCell.c] === '' ? remove(indexOf(e.key, staging), 1, staging) : append(board[selectedCell.r][selectedCell.c], remove(indexOf(e.key, staging), 1, staging)),
        }));
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
        } else if (e.key === ' ') {
          setSpacebarPressed(true);
        }
      }
    }

    window.addEventListener('keydown', listener);

    function spaceUpListener(e) {
      if (e.key === ' ') {
        setSpacebarPressed(false);
      }
    }
    window.addEventListener('keyup', spaceUpListener)

    return () => {
      window.removeEventListener('keydown', listener);
      window.removeEventListener('keyup', spaceUpListener);
    }
  }, [selectedCell, bag, board, staging, selectedDirection, spacebarPressed]);

  function onEmptySquareClick(spacebarPressed, point) {
    if (spacebarPressed) return;
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
    console.log("got values: ", values);

    setState((prevState) => ({
      ...prevState,
      bag: remaining,
      staging: [...prevState.staging, ...values]
    }));
  }

  const noActiveTiles = boardIsEmpty(board) && staging.length === 0;
  const bagEmpty = bag.length === 0;
  const connected = useMemo(() => tilesConnected(board), [board]);

  return (
    <div>
      <div style={{
        display: 'flex',
      }}>
        <div className="Board-window" style={{
          height: 800,
          width: 800,
          border: '2px solid magenta',
          overflow: 'hidden',
          backgroundColor: 'wheat',
        }}>
          <Draggable onStart={() => {
            if (!spacebarPressed) return false
          }}>
            <div style={{
              position: 'relative',
              cursor: spacebarPressed ? 'grab' : 'default',
              left: -BOARD_SIZE * 50 / 4,
              top: -BOARD_SIZE * 50 / 4
            }}>
              <Board
                size={BOARD_SIZE}
                selectedCell={selectedCell}
                selectedDirection={selectedDirection}
                onEmptySquareClick={(e) => onEmptySquareClick(spacebarPressed, e)}
                tiles={board} />
            </div>
          </Draggable>
        </div>
        <Staging letters={staging} />
      </div>
      {noActiveTiles && <button onClick={() => drawTiles(15)}>DRAW TILES</button>}
      <br />
      {!noActiveTiles && connected && !bagEmpty && staging.length===0 && <button onClick={() => drawTiles(1)}>PEEL</button>}
      {bagEmpty && connected && staging.length===0 && <button onClick={() => drawTiles(1)}>BANANAS!</button>}
    </div>
  )
}