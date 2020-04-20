import React from 'react';

import AppLayout from '../components/AppLayout';
import Channels from '../components/Channels';
import SideBar from '../components/SideBar';
import Header from '../components/Header';
import Messages from '../components/Messages';
import SendMessage from '../components/SendMessage';

export default () => (
  <AppLayout>
    <Channels
      channels={[
        { id: 1, letter: 'C' },
        { id: 2, letter: 'W' },
      ]}
    />
    <SideBar
      channelName="coolest"
      ownerUserName="vindx"
      members={[
        { id: 1, userName: 'vindx' },
        { id: 2, userName: 'silver' },
      ]}
    />
    <Header channelName="coolest" />
    <Messages>
      <ul>
        <li>message1</li>
        <li>message2</li>
      </ul>
    </Messages>
    <SendMessage channelName="coolest" />
  </AppLayout>
);
