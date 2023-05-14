/*
 * Copyright 2023 Marek Kobida
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function TicTacToe() {
  React.useEffect(() => {
    window.intercom.open();
  }, []);

  return (
    <div p="4" textAlign="center">
      <div>TicTacToe</div>
      <div cursor="pointer" onClick={() => window.intercom.sendMessage('"Message from TicTacToe"')}>
        Send a WebSocket message
      </div>
    </div>
  );
}

if (typeof window !== 'undefined') {
  ReactDOM.createRoot(window.document.querySelector('#TicTacToe')!).render(<TicTacToe />);
}

export default <div id="TicTacToe"></div>;
