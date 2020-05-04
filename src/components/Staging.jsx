import React from 'react';

import Tile from './Tile';

import './Staging.scss';

export default function Staging(props) {
  const tiles = props.letters.map(letter => (
    <div className="Staging-slot">
      <Tile
        letter={letter}/>
    </div>
  ))
  return (
    <div class="Staging">
      {tiles}
    </div>
  )
}