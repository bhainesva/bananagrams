import React, { useMemo, useCallback } from 'react';

import classNames from 'classnames'
import { useDrop } from 'react-dnd';
import { Types } from './Types';

export default React.memo((props) => {
  const { r, c, handleClick } = props;

  const onClick = useCallback(() => {
    handleClick({r, c});
  }, [r, c, handleClick]);


  const [{ isOver }, drop] = useDrop({
    accept: Types.TILE,
    drop: item => {
      props.onDrop(item.id, {r, c});
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
  const styles = useMemo(() => ({
    zIndex: `${c+1}${r+2}`,
  }), [r, c]);

  return (
    <div ref={drop} className={classes} onClick={onClick}>
        {props.selected && (<div className="Board-squareOverlay"
        style={styles}>
          {direction === 'right' ? '→' : '↓'}
        </div>)}
    </div>
  )
});
