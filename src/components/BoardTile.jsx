import React, { useRef, useMemo, useCallback } from 'react';
import { useDrag } from 'react-dnd';
import { useDrop } from 'react-dnd';
import { Types } from './Types';
import classNames from 'classnames'

import Tile from './Tile';

import './BoardTile.scss';

export default function BoardTile(props) {
  const { r, c, handleClick } = props;

  const onClick = useCallback(() => {
    handleClick({r, c});
  }, [r, c, handleClick])

  const ref = useRef(null);

  const [{isDragging}, drag] = useDrag({
    item: { type: Types.TILE, id: {r, c, letter: props.letter} },
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
  const style = useMemo(() => ({
    left: c*50,
    top: r*50,
    zIndex: `${c+1}${r+1}`,
  }), [r, c]);

  const classes = classNames({
    "BoardTile": true,
    'is-hovered': isOver,
    'is-dragging': isDragging,
  });

  return (
    <div className={classes} style={style} ref={ref} onClick={onClick}>
      <Tile letter={props.letter} isHighlighted={isOver} />
    </div>
  )
}
