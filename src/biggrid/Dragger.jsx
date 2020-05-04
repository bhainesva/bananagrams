import React, { useState } from 'react';
import Draggable from 'react-draggable';

const WIDTH = 600;
const HEIGHT = 600;

const origin = {
  x: WIDTH / 2,
  y: HEIGHT / 2,
}

const points = [
  {x: 10, y: 20},
  {x: 100, y: 200},
  {x: -50, y: 10},
  {x: 0, y: -150},
]

export default function Dragger() {
  return (
    <div className="Wrapper"
      style={{
        height: 200,
        width: 200,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: 'orange',
      }}>
      <Draggable>
        <div style={{
            width: 400,
            height: 400,
            bounds: 'parent',
            border: '4px solid limegreen',
            backgroundColor: 'green',
            position: 'absolute'
          }} />
      </Draggable>
    </div>
  )
}