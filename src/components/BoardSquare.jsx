import React from 'react';

import classNames from 'classnames'
import { useDrop } from 'react-dnd';
import { Types } from './Types';

export default function BoardSquare(props) {
  const { x, y } = props;

  const [{ isOver }, drop] = useDrop({
    accept: Types.TILE,
    drop: item => {
      props.onDrop(item.id, {x, y});
    },
		collect: monitor => ({
			isOver: !!monitor.isOver(),
		}),
  });

  const classes = classNames({
    "Board-square": true,
    'is-hovered': isOver,
  })

  return (
    <div ref={drop} className={classes} />
  )
}
