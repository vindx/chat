import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

import SideBar from '../components/SideBar';
import InvitePeopleModal from '../components/modals/InvitePeopleModal';
import ChannelOptionsModal from '../components/modals/ChannelOptionsModal';
import {
  getChannelQuery,
  smbJoinedChannelSubscription,
  smbLeftChannelSubscription,
} from '../graphql/channel';
import setViewModeStatus from '../helpers/setViewModeStatus';

const SideBarContainer = ({
  setChannelName,
  currentChannelId = '',
  history,
  displaySideBar,
  toggleDisplaySideBar,
  onProfileClick,
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
    if (error) {
      setChannelName('');
    } else if (name) {
      setChannelName(name);
    }
    if (currentChannelId) {
      const smbJoinedChannelUnSubscribe = subscribeToMore({
        document: smbJoinedChannelSubscription,
        variables: { channelId: currentChannelId },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData) return prev;

          const whoJoinedChannel = subscriptionData.data.smbJoinedChannel.members.reduce(
            // eslint-disable-next-line array-callback-return,consistent-return
            (member, acc) => {
              if (member) {
                const newMember = prev.getChannel.members.find(({ id }) => id !== member.id);
                return { ...acc, ...newMember };
              }
            },
            {}
          );
          toast.success(`User '${whoJoinedChannel.userName}' has joined the channel`);

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

          const whoLeftChannel = prev.getChannel.members.reduce(
            // eslint-disable-next-line array-callback-return,consistent-return
            (member, acc) => {
              if (member) {
                const userWhoLeft = subscriptionData.data.smbLeftChannel.members.find(
                  ({ id }) => id !== member.id
                );
                return { ...acc, ...userWhoLeft };
              }
            },
            {}
          );
          toast.error(`User '${whoLeftChannel.userName}' has left the channel`);

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
  }, [name, setChannelName, currentChannelId, subscribeToMore, error]);

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
  if (error) return null;
  const viewMode = setViewModeStatus(ownerId);

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
      onProfileClick={onProfileClick}
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
