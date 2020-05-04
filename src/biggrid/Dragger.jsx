import React from 'react';
import Draggable from 'react-draggable';

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