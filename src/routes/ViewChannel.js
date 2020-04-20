import React from 'react';
import { Input } from 'semantic-ui-react';

import AppLayout from '../components/AppLayout';
import Channels from '../components/Channels';
import Members from '../components/Members';
import Header from '../components/Header';
import Messages from '../components/Messages';
import SendMessage from '../components/SendMessage';

export default () => (
  <AppLayout>
    <Channels>Channels</Channels>
    <Members>Members</Members>
    <Header>channelName</Header>
    <Messages>
      <ul>
        <li>message1</li>
        <li>message2</li>
      </ul>
    </Messages>
    <SendMessage>
      <Input fluid placeholder="Message" />
    </SendMessage>
  </AppLayout>
);
