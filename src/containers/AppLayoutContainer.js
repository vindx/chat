import React, { useState } from 'react';
import PropTypes from 'prop-types';

import AppLayout from '../components/AppLayout';
import ChannelsContainer from './ChannelsContainer';
import SideBarContainer from './SideBarContainer';
import Header from '../components/Header';
import MessagesContainer from './MessagesContainer';
import SendMessage from '../components/SendMessage';

const AppLayoutContainer = ({ match: { params }, history }) => {
  const [channelName, setChannelName] = useState('');

  return (
    <AppLayout>
      <ChannelsContainer currentChannelId={params.channelId} history={history} />
      <SideBarContainer setChannelName={setChannelName} currentChannelId={params.channelId} />
      <Header channelName={channelName} />
      <MessagesContainer currentChannelId={params.channelId} />
      <SendMessage channelName={channelName} currentChannelId={params.channelId} />
    </AppLayout>
  );
};

AppLayoutContainer.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      channelId: PropTypes.string,
    }),
  }).isRequired,
  history: PropTypes.shape({}).isRequired,
};

export default AppLayoutContainer;
