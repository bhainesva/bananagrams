import React, { useState, useEffect, useMemo, useCallback } from 'react';

import { curry, remove, always, contains, append, indexOf } from 'ramda';

import Draggable from 'react-draggable';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';

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
  const values = list.length ? [list[index]] : [];
  return {values, remaining: remove(index, 1, list)}
}

function selectX(list, x) {
  let selections = [];
  let selectionList = list;

  for (let i = 0; i < x; i++) {
    const {values, remaining} = select1(selectionList);
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

function removeLetter(board, {r, c}) {
  const clone = board.map(row => row.slice());
  clone[r][c] = '';
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
    if (seen.has(`${current.r},${current.c}`)) continue;
    seen.add(`${current.r},${current.c}`);
    count += 1;
    const n = getNeighbors(current)
      .filter(inBounds(board))
      .filter(({r, c}) => !!board[r][c])
    stack = [...stack, ...n];
  }

  return totalTiles === count;
}

const initialTiles =
  Array.from({length: BOARD_SIZE}).map(() =>
    Array.from({length: BOARD_SIZE}).map(
      always('')));
// initialTiles[Math.floor(BOARD_SIZE/2)][Math.floor(BOARD_SIZE/2)] = 'z';

const flexStyle = {
  display: 'flex',
}

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

const boardWindowStyle = {
  height: 800,
  width: 800,
  border: '2px solid magenta',
  overflow: 'hidden',
  backgroundColor: 'wheat',
};

const swapTile = curry((board, pt1, pt2) => {
  const clone = board.map(row => row.slice());
  const tmp = clone[pt1.r][pt1.c];
  clone[pt1.r][pt1.c] = clone[pt2.r][pt2.c];
  clone[pt2.r][pt2.c] = tmp;
  return clone
});

const onTileDrop = ({board, staging}, id, dest) => {
  if (dest === null) {
    return {
      board:  id.r !== null ? removeLetter(board, id) : board,
      staging: id.r !== null ? append(id.letter, staging) : staging,
    }
  } else {
    return {
      board:  id.r !== null ? swapTile(board, id, dest) : insertLetter(board, dest, id.letter),
      staging: id.r !== null ? staging : remove(indexOf(id.letter, staging), 1, staging),
    }
  }
};

export default function Game() {
  const [{ board, bag, staging }, setState] = useState({board: initialTiles, bag: smallBag, staging: []})
  const [{selectedCell, selectedDirection}, setSelected] = useState({selectedCell: null, selectedDirection: null});
  const [spacebarPressed, setSpacebarPressed] = useState(false);
  const [won, setWon] = useState(false);

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

  const onEmptySquareClick = useMemo(() => (spacebarPressed, point) => {
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
  }, [selectedCell, selectedDirection]);

  const handleEmptySquareClick = useMemo(() => (e) => onEmptySquareClick(spacebarPressed, e), [spacebarPressed, onEmptySquareClick]);

  function restart() {
    setState({
      board: initialTiles,
      bag: initialBag,
      staging: [],
    })

    setWon(false);
  }

  function win() {
    setWon(true);
  }

  const drawTiles = useMemo(() => (n) => {
    const { values, remaining } = selectX(bag, n);

    setState((prevState) => ({
      ...prevState,
      bag: remaining,
      staging: [...prevState.staging, ...values]
    }));
  }, [bag]);

  const draw15Tiles = useMemo(() => () => drawTiles(15), [drawTiles]);
  const draw1Tile = useMemo(() => () => drawTiles(1), [drawTiles]);



  const noActiveTiles = boardIsEmpty(board) && staging.length === 0;
  const bagEmpty = bag.length === 0;
  const connected = useMemo(() => tilesConnected(board), [board]);

  const onStart = useCallback(() => spacebarPressed, [spacebarPressed]);
  const draggableStyle = useMemo(() => ({
    position: 'relative',
    cursor: spacebarPressed ? 'grab' : 'default',
    left: -BOARD_SIZE * 50 / 4,
    top: -BOARD_SIZE * 50 / 4
  }), [spacebarPressed]);

  const handleTileDrop = useCallback((id, dest) => setState((state) => ({
    ...state,
    ...onTileDrop(state, id, dest),
  })), [setState]);

  return (
    <div>
      <div style={flexStyle}>
      <DndProvider backend={Backend}>
        <div className="Board-window" style={boardWindowStyle}>
          <Draggable onStart={onStart}>
            <div style={draggableStyle}>
              <Board
                size={BOARD_SIZE}
                selectedCell={selectedCell}
                selectedDirection={selectedDirection}
                onEmptySquareClick={handleEmptySquareClick}
                onTileDrop={handleTileDrop}
                tiles={board} />
            </div>
          </Draggable>
        </div>
        <Staging letters={staging}
                 onDrop={handleTileDrop} />
      </DndProvider>
      </div>
      <div>
        {won && "YOU WON!"}
        {!won && noActiveTiles && <button onClick={draw15Tiles}>DRAW TILES</button>}
        {!won && <button disabled={!connected || bagEmpty || staging.length!==0} onClick={draw1Tile}>PEEL</button>}
        {!won && <button disabled={!bagEmpty || !connected || staging.length!==0} onClick={win}>BANANAS!</button>}
        {<button onClick={restart}>Restart</button>}
      </div>
    </div>
  )
}