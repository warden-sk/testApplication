/*
 * Copyright 2023 Marek Kobida
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import createRequest from '../client/private/helpers/createRequest';
import EnhancedRegExp from '../helpers/enhancements/EnhancedRegExp';
import type { TransformedEnhancedAccount } from '../server/enhancements/EnhancedAccount';
import './index.css';
import TicTacToe from './TicTacToe';

function Client() {
  const [, request] = createRequest();
  const [account, updateAccount] = React.useState<TransformedEnhancedAccount>();
  const [applicationVersionId, updateApplicationVersionId] = React.useState<string>();

  React.useEffect(() => {
    /* (1/3) */ const pattern = EnhancedRegExp.getApplicationRoutePattern<{
      applicationVersionId: string;
      path: string;
    }>('/:applicationVersionId(?<path>/[^#/?]+)');

    /* (2/3) */ const { applicationVersionId } = pattern.getGroups(location.toString());

    /* (3/3) */ updateApplicationVersionId(applicationVersionId);

    request('/me').then(updateAccount, () => {});
  }, []);

  React.useEffect(() => {
    window.intercom.open();
  }, []);

  function sendWebSocketMessage(message: any) {
    window.intercom.sendMessage?.(JSON.stringify([applicationVersionId, message]));
  }

  if (account) {
    return (
      <div alignItems="center" display="flex" height="100" justifyContent="center">
        <TicTacToe account={account} sendWebSocketMessage={sendWebSocketMessage} />
      </div>
    );
  }
}

if (typeof window !== 'undefined') {
  ReactDOM.createRoot(window.document.querySelector('#client')!).render(<Client />);
}

export default <div height="100" id="client"></div>;
