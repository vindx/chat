import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import {
  BottomSection,
  ChannelNameHeader,
  DisplayTriggerIcon,
  Green,
  PushLeft,
  SideBarContent,
  SideBarDisplayTrigger,
  SideBarList,
  SideBarListHeader,
  SideBarListItem,
  SideBarListWrapper,
  SideBarWrapper,
} from './styledComponents/SideBar';

const Bubble = ({ online }) => (online ? <Green>● </Green> : '○ ');

const member = ({ id, userName, onProfileClick }) => (
  <SideBarListItem key={`member-${id}`} id={id} onClick={onProfileClick}>
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
  display,
  toggleDisplay,
  onProfileClick,
}) => (
  <SideBarWrapper display={display.toString()}>
    <SideBarContent display={display.toString()}>
      <PushLeft>
        <ChannelNameHeader>{channelName}</ChannelNameHeader>
        {ownerUserName}
      </PushLeft>
      <SideBarListWrapper>
        <SideBarListHeader>Members</SideBarListHeader>
        <SideBarList>
          {members.map((memberInfo) => member({ ...memberInfo, onProfileClick }))}
        </SideBarList>
        {!viewMode && (
          <Button onClick={onInvitePeopleClick} positive floated="right">
            + Invite people
          </Button>
        )}
      </SideBarListWrapper>
      <BottomSection display={display.toString()}>
        <Button onClick={onChannelOptionsClick} negative>
          {viewMode ? 'Leave channel' : 'Delete channel'}
        </Button>
      </BottomSection>
    </SideBarContent>
    <SideBarDisplayTrigger onClick={toggleDisplay}>
      <DisplayTriggerIcon display={display.toString()}>
        <Icon name="play" />
      </DisplayTriggerIcon>
    </SideBarDisplayTrigger>
  </SideBarWrapper>
);

Bubble.propTypes = {
  online: PropTypes.bool.isRequired,
};

member.propTypes = {
  id: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  onProfileClick: PropTypes.func.isRequired,
};

SideBar.propTypes = {
  channelName: PropTypes.string.isRequired,
  ownerUserName: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  members: PropTypes.array.isRequired,
  onInvitePeopleClick: PropTypes.func.isRequired,
  viewMode: PropTypes.bool.isRequired,
  onChannelOptionsClick: PropTypes.func.isRequired,
  display: PropTypes.bool.isRequired,
  toggleDisplay: PropTypes.func.isRequired,
  onProfileClick: PropTypes.func.isRequired,
};

export default SideBar;
