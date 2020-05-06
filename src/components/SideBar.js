import React from 'react';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import {
  BottomSection,
  ChannelNameHeader,
  Green,
  PushLeft,
  SideBarList,
  SideBarListHeader,
  SideBarListItem,
  SideBarListWrapper,
  SideBarWrapper,
} from './styledComponents/SideBar';

const Bubble = ({ online }) => (online ? <Green>● </Green> : '○ ');

const member = ({ id, userName }) => (
  <SideBarListItem key={`member-${id}`}>
    <Bubble online />
    {userName}
  </SideBarListItem>
);

const SideBar = ({
  channelName,
  ownerUserName,
  members,
  onInvitePeopleClick,
  viewMode,
  onChannelOptionsClick,
}) => (
  <SideBarWrapper>
    <PushLeft>
      <ChannelNameHeader>{channelName}</ChannelNameHeader>
      {ownerUserName}
    </PushLeft>
    <SideBarListWrapper>
      <SideBarListHeader>Members</SideBarListHeader>
      <SideBarList>{members.map(member)}</SideBarList>
      {!viewMode && (
        <Button onClick={onInvitePeopleClick} positive floated="right">
          + Invite people
        </Button>
      )}
    </SideBarListWrapper>
    <BottomSection>
      <Button onClick={onChannelOptionsClick} negative>
        {viewMode ? 'Leave channel' : 'Delete channel'}
      </Button>
    </BottomSection>
  </SideBarWrapper>
);

Bubble.propTypes = {
  online: PropTypes.bool.isRequired,
};

member.propTypes = {
  id: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
};

SideBar.propTypes = {
  channelName: PropTypes.string.isRequired,
  ownerUserName: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  members: PropTypes.array.isRequired,
  onInvitePeopleClick: PropTypes.func.isRequired,
  viewMode: PropTypes.bool.isRequired,
  onChannelOptionsClick: PropTypes.func.isRequired,
};

export default SideBar;
