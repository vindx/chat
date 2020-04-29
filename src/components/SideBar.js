import React from 'react';
import styled from 'styled-components';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const paddingLeft = 'padding-left: 10px';
const PushLeft = styled.div`
  ${paddingLeft}
`;

export const SideBarWrapper = styled.div`
  grid-column: 2;
  grid-row: 1/4;
  background-color: #ffa07a;
  color: #fffafa;
  display: flex;
  flex-direction: column;
`;

export const BottomSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 1em;
  :last-of-type {
    margin-top: auto;
  }
`;

const ChannelNameHeader = styled.h1`
  font-size: 30px;
  margin: 0;
`;

const SideBarListWrapper = styled.div`
  width: 100%;
  margin: 1em 0;
  list-style: none;
  display: flex;
  flex-direction: column;
`;

const SideBarList = styled.ul`
  margin: 0 0 10px 0;
  padding-left: 0;
  list-style: none;
  max-height: 30vh;
  overflow-y: auto;
`;

const SideBarListItem = styled.li`
  ${paddingLeft};
  &:hover {
    background: #6ab0c1;
  }
`;

const SideBarListHeader = styled.li`
  font-size: 14px;
  ${paddingLeft};
`;

const Green = styled.span`
  color: #6dca98;
`;

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
