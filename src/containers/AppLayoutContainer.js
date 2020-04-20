import React, { useState } from 'react';

import AppLayout from '../components/AppLayout';
import ChannelsContainer from './ChannelsContainer';
import SideBarContainer from './SideBarContainer';
import Header from '../components/Header';
import MessagesContainer from './MessagesContainer';
import SendMessage from '../components/SendMessage';

export default () => {
  const [channelName, setChannelName] = useState('');

  return (
    <AppLayout>
      <ChannelsContainer />
      <SideBarContainer setChannelName={setChannelName} />
      <Header channelName={channelName} />
      <MessagesContainer />
      <SendMessage channelName={channelName} />
    </AppLayout>
  );
};
