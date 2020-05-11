import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import decode from 'jwt-decode';
import PropTypes from 'prop-types';

import SideBar from '../components/SideBar';
import InvitePeopleModal from '../components/InvitePeopleModal';
import ChannelOptionsModal from '../components/ChannelOptionsModal';
import {
  getChannelQuery,
  smbJoinedChannelSubscription,
  smbLeftChannelSubscription,
} from '../graphql/channel';

const SideBarContainer = ({
  setChannelName,
  currentChannelId = '',
  history,
  displaySideBar,
  toggleDisplaySideBar,
}) => {
  const {
    subscribeToMore,
    // loading,
    error,
    data: {
      getChannel: { name, owner: { id: ownerId, userName: ownerUserName } = {}, members } = {},
    } = {},
  } = useQuery(getChannelQuery, {
    variables: { id: currentChannelId },
    fetchPolicy: 'network-only',
  });
  const [invitePeopleModalIsOpen, setToggleInvitePeopleModal] = useState(false);
  const [channelOptionsModalIsOpen, setToggleChannelOptionsModal] = useState(false);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (name) {
      setChannelName(name);
    }
    if (currentChannelId) {
      const smbJoinedChannelUnSubscribe = subscribeToMore({
        document: smbJoinedChannelSubscription,
        variables: { channelId: currentChannelId },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData) return prev;

          return {
            ...prev,
            getChannel: {
              ...prev.getChannel,
              members: subscriptionData.data.smbJoinedChannel.members,
            },
          };
        },
      });
      const smbLeftChannelUnSubscribe = subscribeToMore({
        document: smbLeftChannelSubscription,
        variables: { channelId: currentChannelId },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData) return prev;

          return {
            ...prev,
            getChannel: {
              ...prev.getChannel,
              members: subscriptionData.data.smbLeftChannel.members,
            },
          };
        },
      });
      return () => {
        smbJoinedChannelUnSubscribe();
        smbLeftChannelUnSubscribe();
      };
    }
  }, [name, setChannelName, currentChannelId, subscribeToMore]);

  const toggleInvitePeopleModal = () => {
    setToggleInvitePeopleModal(!invitePeopleModalIsOpen);
  };

  const toggleChannelOptionsModal = () => {
    setToggleChannelOptionsModal(!channelOptionsModalIsOpen);
  };

  // if (loading) return <p>Loading...</p>;
  if (!name) {
    return null;
  }
  if (error) return <p>Error :(</p>;
  const {
    user: { id },
  } = decode(localStorage.getItem('token'));
  const viewMode = ownerId !== id;

  return [
    <SideBar
      key="sidebar"
      channelName={name}
      ownerUserName={ownerUserName}
      members={members}
      onInvitePeopleClick={toggleInvitePeopleModal}
      onChannelOptionsClick={toggleChannelOptionsModal}
      viewMode={viewMode}
      display={displaySideBar}
      toggleDisplay={toggleDisplaySideBar}
    />,
    <InvitePeopleModal
      key="invite-people-modal"
      isOpen={invitePeopleModalIsOpen}
      onClose={toggleInvitePeopleModal}
      channelId={currentChannelId}
    />,
    <ChannelOptionsModal
      key="channel-options-modal"
      viewMode={viewMode}
      isOpen={channelOptionsModalIsOpen}
      onClose={toggleChannelOptionsModal}
      channelId={currentChannelId}
      history={history}
    />,
  ];
};

SideBarContainer.propTypes = {
  setChannelName: PropTypes.func.isRequired,
  currentChannelId: PropTypes.string,
  displaySideBar: PropTypes.bool.isRequired,
  toggleDisplaySideBar: PropTypes.func.isRequired,
};
SideBarContainer.defaultProps = {
  currentChannelId: undefined,
};

export default SideBarContainer;
