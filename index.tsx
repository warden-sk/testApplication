/*
 * Copyright 2023 Marek Kobida
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function TicTacToe() {
  return <div>TicTacToe</div>;
}

if (typeof window !== 'undefined') {
  ReactDOM.createRoot(window.document.querySelector('#TicTacToe')!).render(<TicTacToe />);
}

export default <div id="TicTacToe"></div>;
