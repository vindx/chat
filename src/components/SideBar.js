import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const paddingLeft = 'padding-left: 10px';
const PushLeft = styled.div`
  ${paddingLeft}
`;

const SideBarWrapper = styled.div`
  grid-column: 2;
  grid-row: 1/4;
  background-color: #ffa07a;
  color: #fffafa;
`;

const ChannelNameHeader = styled.h1`
  font-size: 20px;
  margin: 0;
`;

const SideBarList = styled.ul`
  width: 100%;
  list-style: none;
  padding-left: 0;
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

const SideBar = ({ channelName, ownerUserName, members }) => (
  <SideBarWrapper>
    <PushLeft>
      <ChannelNameHeader>{channelName}</ChannelNameHeader>
      {ownerUserName}
    </PushLeft>
    <SideBarList>
      <SideBarListHeader>Members</SideBarListHeader>
      {members.map(member)}
    </SideBarList>
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
};

export default SideBar;
