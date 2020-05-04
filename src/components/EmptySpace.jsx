import React from 'react';

import classNames from 'classnames'
import { useDrop } from 'react-dnd';
import { Types } from './Types';

export default function EmptySpace(props) {
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
    'is-selected': props.selected,
  })

  const direction = props.direction;

  return (
    <div ref={drop} className={classes} onClick={props.onClick}>
      {props.selected
        ? direction === 'right'
          ? '-->'
          : direction === 'down'
            ? '|\nv'
            : null
        : null}
    </div>
  )
}
