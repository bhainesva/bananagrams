import React from 'react';

import classnames from 'classnames';

import './Tile.scss';

const style= {
  width: '100%',
  height: '100%',
}

export default function Tile(props) {
  const classes = classnames({
    "Tile": true,
    "is-highlighted": props.isHighlighted,
  })

  return (
    <div className={classes} style={style}>
      {props.letter}
    </div>
  )
}
