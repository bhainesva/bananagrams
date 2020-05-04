import React from 'react';

import './Tile.scss';

export default function Tile(props) {
  const style= {
    backgroundColor: 'orange',
    width: '100%',
    height: '100%',
  }

  return (
    <div className="Tile" style={style}>
      {props.letter}
    </div>
  )
}
