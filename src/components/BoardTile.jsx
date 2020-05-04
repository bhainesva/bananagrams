import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { useDrop } from 'react-dnd';
import { Types } from './Types';

import Tile from './Tile';

export default function BoardTile(props) {
  const { r, c } = props;

  const ref = useRef(null);

  const [{isDragging}, drag] = useDrag({
    item: { type: Types.TILE, id: {r, c} },
		collect: monitor => ({
			isDragging: !!monitor.isDragging(),
		}),
  });

  const [{ isOver }, drop] = useDrop({
    accept: Types.TILE,
    drop: (item) => {
      props.onDrop(item.id, {r, c});
    },
		collect: monitor => ({
			isOver: !!monitor.isOver(),
		}),
  })

  drag(drop(ref));
  const style= {
    backgroundColor: isOver ? 'blue' : 'orange',
    position: 'absolute',
    left: c*50,
    top: r*50,
    width: 50,
    height: 50,
    zIndex: `${c+1}${r+1}`,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div className="" style={style}>
      <Tile letter={props.letter} />
    </div>
  )
}
