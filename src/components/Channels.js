import React from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const ChannelWrapper = styled.div`
  grid-column: 1;
  grid-row: 1/4;
  background-color: #ff7f50;
`;

const ChannelList = styled.ul`
  width: 100%;
  padding-left: 0px;
  list-style: none;
`;

const ChannelListItem = styled.li`
  height: 50px;
  width: 50px;
  background-color: #679ed2;
  border-color: #408ad2;
  color: #fffafa;
  margin: auto;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  border-radius: 10px;
  cursor: pointer;
  &:hover {
    border-style: solid;
    border-width: thick;
  }
  ${({ active }) =>
    active && css`
      border-style: solid;
      border-width: thick;
      border-color: #408ad2;
    `}
  ${({ bgColor }) =>
    bgColor && css`
      background-color: ${bgColor};
    `}
  ${({ borderColor }) =>
    borderColor && css`
      border-color: ${borderColor};
    `}
`;

const channel = ({ id, name, active }) => (
  <Link key={`channel-${id}`} to={`/view-channel/${id}`}>
    <ChannelListItem active={active} title={name}>
      {name.charAt(0).toUpperCase()}
    </ChannelListItem>
  </Link>
);

const Channels = ({ channels, currentChannelId, onAddChannelClick }) => {
  // eslint-disable-next-line no-confusing-arrow
  const channelsWithActive = channels.map((ch) =>
    currentChannelId === ch.id ? { ...ch, active: true } : ch
  );
  return (
    <ChannelWrapper>
      <ChannelList>
        {channelsWithActive.map(channel)}
        <ChannelListItem
          title="Add channel"
          bgColor="#8EEC6A"
          borderColor="#3BDA00"
          onClick={onAddChannelClick}
        >
          +
        </ChannelListItem>
      </ChannelList>
    </ChannelWrapper>
  );
};

channel.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  active: PropTypes.bool,
};
channel.defaultProps = {
  active: false,
};

Channels.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  channels: PropTypes.array.isRequired,
  currentChannelId: PropTypes.string,
  onAddChannelClick: PropTypes.func.isRequired,
};
Channels.defaultProps = {
  currentChannelId: undefined,
};

export default Channels;
