/*
 * Copyright 2023 Marek Kobida
 */

import React from 'react';
import createRequest from '../client/private/helpers/createRequest';
import messages from '../helpers/messages';
import type { TransformedEnhancedAccount } from '../server/enhancements/EnhancedAccount';

interface P extends EnhancedJSXElement<'select'> {
  account: TransformedEnhancedAccount;
}

function FriendSelector({ account, ...$ }: P) {
  const [, request] = createRequest();
  const [friends, updateFriends] = React.useState<TransformedEnhancedAccount[]>([]);

  React.useEffect(() => {
    request(`/account/${account.id}/friend`).then(updateFriends, () => {});
  }, []);

  return (
    <div spaceY="2">
      <label display="block" htmlFor="FriendSelector">
        {messages.FRIENDS}
      </label>
      <select {...$} border="1" borderRadius="2" display="block" id="FriendSelector" p="2" width="100">
        <option>{friends.length > 0 ? '\u2014' : messages.NO_FRIENDS}</option>
        {friends.map(friend => (
          <option key={friend.id} value={friend.id}>
            {friend.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default FriendSelector;
