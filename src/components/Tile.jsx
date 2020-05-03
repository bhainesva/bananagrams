import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { useDrop } from 'react-dnd';
import { Types } from './Types';

import './Tile.scss';

export default function Tile(props) {
  const { id, x, y } = props;

  const ref = useRef(null);

  const [{isDragging}, drag] = useDrag({
    item: { type: Types.TILE, id },
		collect: monitor => ({
			isDragging: !!monitor.isDragging(),
		}),
  });

  const [{ isOver }, drop] = useDrop({
    accept: Types.TILE,
    drop: (item) => {
      props.onDrop(item.id, id);
    },
		collect: monitor => ({
			isOver: !!monitor.isOver(),
		}),
  })

  drag(drop(ref));
  const style= {
    backgroundColor: isOver ? 'blue' : 'orange',
    gridColumnStart: x + 1,
    gridRowStart: y + 1,
    zIndex: `${x+1}${y+1}`,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div className="Tile" ref={ref} style={style}>
      {props.children}
    </div>
  )
}
