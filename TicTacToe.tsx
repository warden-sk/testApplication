/*
 * Copyright 2023 Marek Kobida
 */

import React from 'react';
import type { TransformedEnhancedAccount } from '../server/enhancements/EnhancedAccount';
import FriendSelector from './FriendSelector';
import selectWinnerFromBoard from './selectWinnerFromBoard';
import type { EnhancedSetState } from './useState';
import useState from './useState';

interface Game {
  board: string[];
  players: [string, string][];
  winner: string;
  xIsNext: boolean;
}

interface P {
  account: TransformedEnhancedAccount;
  sendWebSocketMessage: (message: any) => void;
}

function TicTacToe({ account, sendWebSocketMessage }: P) {
  const [game, updateGame] = useState<Game>({
    board: [...new Array(9)],
    players: [[account.id, account.name]],
    winner: '',
    xIsNext: true,
  });

  const char = game.players[0][0] === account.id ? 'X' : 'O';

  const notHave2ndPlayer = game.players[1] === undefined;

  const enhancedUpdateGame: EnhancedSetState<Game> = game => {
    updateGame(game);

    sendWebSocketMessage(game);
  };

  React.useEffect(() => {
    function onMessage(e: MessageEvent) {
      const data = JSON.parse(e.data);

      if (Array.isArray(data.testMessage)) {
        const { accountId: wsAccountId, accountName: wsAccountName } = data;
        const [, message] = data.testMessage;

        if (notHave2ndPlayer) {
          if (wsAccountId !== account.id && message.friendId !== account.id) {
            updateGame({
              players: [
                [account.id, account.name],
                [wsAccountId, wsAccountName],
              ],
            });
          }

          if (wsAccountId !== account.id && message.friendId === account.id) {
            updateGame({
              players: [
                [wsAccountId, wsAccountName],
                [account.id, account.name],
              ],
            });

            sendWebSocketMessage({ friendId: account.id });
          }
        }

        if (wsAccountId !== account.id) {
          if (message.board !== undefined) {
            updateGame({ board: message.board });
          }
          if (message.winner !== undefined) {
            updateGame({ winner: message.winner });
          }
          if (message.xIsNext !== undefined) {
            updateGame({ xIsNext: message.xIsNext });
          }
        }
      }
    }

    window.intercom.wss?.addEventListener('message', onMessage);

    return () => {
      window.intercom.wss?.removeEventListener('message', onMessage);
    };
  }, [game.players[1]]);

  function message() {
    if (game.winner) {
      return `${game.winner} vyhráva`;
    } else if (game.board.every(cell => cell)) {
      return 'remíza';
    } else {
      return game.xIsNext ? 'X' : 'O';
    }
  }

  function on(i: number) {
    if (notHave2ndPlayer) {
      return;
    }

    if ((game.xIsNext ? 'X' : 'O') !== char) {
      return;
    }

    if (game.board[i]) {
      return;
    }

    if (game.board.every(cell => cell)) {
      enhancedUpdateGame({ board: [...new Array(9)], winner: '', xIsNext: true });
      return;
    }

    if (game.winner) {
      enhancedUpdateGame({ board: [...new Array(9)], winner: '', xIsNext: true });
      return;
    }

    const newBoard = [...game.board];
    newBoard[i] = game.xIsNext ? 'X' : 'O';
    enhancedUpdateGame({ board: newBoard });

    const $winningLine = selectWinnerFromBoard(newBoard);

    if ($winningLine) {
      enhancedUpdateGame({ winner: $winningLine[1] });
    }

    const xIsNext = !game.xIsNext;
    enhancedUpdateGame({ xIsNext });
  }

  const [$winningLine = []] = selectWinnerFromBoard(game.board) ?? [];

  return (
    <div spaceY="4">
      {notHave2ndPlayer && (
        <FriendSelector
          account={account}
          onInput={e => {
            sendWebSocketMessage({ friendId: e.currentTarget.value });
          }}
        />
      )}
      <div fontSize="2" opacity={notHave2ndPlayer && '50'} textAlign="center">
        {message()}
      </div>
      <table border="1" opacity={notHave2ndPlayer && '50'} textAlign="center">
        <tbody>
          {[...new Array(3)].map(($, i) => {
            return (
              <tr key={i}>
                {[...new Array(3)].map(($, j) => {
                  const k = i * 3 + j;

                  return (
                    <td
                      border="1"
                      className={{ 'border-color(red)': $winningLine.indexOf(k) !== -1 }}
                      cursor="pointer"
                      fontSize="8"
                      key={k}
                      onClick={() => on(k)}
                      style={{ height: '5rem', width: '5rem' }}
                    >
                      {game.board[k]}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td
              border="1"
              className={{ 'border-color(red)': game.players[0][0] === account.id }}
              colSpan={2}
              fontSize="2"
            >
              {game.players[0][1]}
            </td>
            <td border="1" className={{ 'border-color(red)': game.players[0][0] === account.id }}>
              X
            </td>
          </tr>
          <tr>
            <td
              border="1"
              className={{ 'border-color(red)': game.players[1]?.[0] === account.id }}
              colSpan={2}
              fontSize="2"
            >
              {game.players[1]?.[1] ?? '\u2014'}
            </td>
            <td border="1" className={{ 'border-color(red)': game.players[1]?.[0] === account.id }}>
              O
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default TicTacToe;
