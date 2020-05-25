import React from 'react';

import whyDidYouRender from '@welldone-software/why-did-you-render'
import ReactDOM from 'react-dom';
import './index.css';
import './base.scss';

import Game from './components/Game'

whyDidYouRender(React, {
  trackAllPureComponents: true,
});



const root = document.getElementById('root');

// ReactDOM.render(<Dragger></Dragger>, root);

// observe(knightPosition =>
//   ReactDOM.render(<Board knightPosition={knightPosition} />, root),
// )

ReactDOM.render(<Game></Game>, root);

