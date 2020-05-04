import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './base.scss';
import Dragger from './biggrid/Dragger';

import DemoBoard from './dnddemo/Board'
import { observe } from './dnddemo/Game'

import Game from './components/Game'
import Board from './components/Board'


const root = document.getElementById('root');

// ReactDOM.render(<Dragger></Dragger>, root);

// observe(knightPosition =>
//   ReactDOM.render(<Board knightPosition={knightPosition} />, root),
// )

ReactDOM.render(<Game></Game>, root);

