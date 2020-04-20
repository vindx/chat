import React from 'react';
import styled from 'styled-components';
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
    border-color: #408ad2;
  }
`;

const channel = ({ id, letter }) => (
  <ChannelListItem key={`channel-${id}`}>{letter}</ChannelListItem>
);

const Channels = ({ channels }) => (
  <ChannelWrapper>
    <ChannelList>{channels.map(channel)}</ChannelList>
  </ChannelWrapper>
);

channel.propTypes = {
  id: PropTypes.string.isRequired,
  letter: PropTypes.string.isRequired,
};

Channels.propTypes = {
  channels: PropTypes.shape([]).isRequired,
};

export default Channels;
