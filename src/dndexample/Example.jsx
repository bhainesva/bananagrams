import React from 'react'
import Dustbin from './Dustbin'
import Box from './Box'
import Tile from '../components/Tile'
import BoardSquare from '../components/BoardSquare'

import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';

export default function Example() {
  return (
    <DndProvider backend={Backend}>
      <Dustbin />
      <div>
        <Box name="Hello"></Box>

        <Tile>What</Tile>
      </div>

      <BoardSquare>
        THE BOARDSQUARE
      </BoardSquare>
    </DndProvider>
  )
}