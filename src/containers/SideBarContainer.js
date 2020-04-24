import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import decode from 'jwt-decode';
import PropTypes from 'prop-types';

import SideBar, { SideBarWrapper } from '../components/SideBar';
import InvitePeopleModal from '../components/InvitePeopleModal';
import ChannelOptionsModal from '../components/ChannelOptionsModal';
import { getChannelQuery } from '../graphql/channel';

const SideBarContainer = ({ setChannelName, currentChannelId = '', history }) => {
  const {
    loading,
    error,
    data: {
      getChannel: { name, owner: { id: ownerId, userName: ownerUserName } = {}, members } = {},
    } = {},
  } = useQuery(getChannelQuery, {
    variables: { id: currentChannelId },
  });
  const [invitePeopleModalIsOpen, setToggleInvitePeopleModal] = useState(false);
  const [channelOptionsModalIsOpen, setToggleChannelOptionsModal] = useState(false);

  useEffect(() => {
    if (name) {
      setChannelName(name);
    }
  }, [name, setChannelName]);

  const toggleInvitePeopleModal = () => {
    setToggleInvitePeopleModal(!invitePeopleModalIsOpen);
  };

  const toggleChannelOptionsModal = () => {
    setToggleChannelOptionsModal(!channelOptionsModalIsOpen);
  };

  if (loading) return <p>Loading...</p>;
  if (!name) {
    return (
      <SideBarWrapper style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Please choose channel
      </SideBarWrapper>
    );
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
};
SideBarContainer.defaultProps = {
  currentChannelId: undefined,
};

export default SideBarContainer;
