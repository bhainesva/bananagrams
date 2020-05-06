import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Types } from './Types';

import Tile from './Tile';

import './Staging.scss';

export default function Staging(props) {
  const [{ isOver }, drop] = useDrop({
    accept: Types.TILE,
    drop: (item) => {
      props.onDrop(item.id, null);
    },
		collect: monitor => ({
			isOver: !!monitor.isOver(),
		}),
  })

  const tiles = props.letters.map((letter, i) => (
    <StagingTile key={i} letter={letter} />
  ))
  return (
    <div className="Staging" ref={drop}>
      {tiles}
    </div>
  )
}

function StagingTile(props) {
  const [{isDragging}, drag] = useDrag({
    item: { type: Types.TILE, id: {r: null, c: null, letter: props.letter } },
		collect: monitor => ({
			isDragging: !!monitor.isDragging(),
		}),
  })

  return (
    <div ref={drag} className="Staging-slot">
      <Tile
        letter={props.letter}/>
    </div>
  )
}