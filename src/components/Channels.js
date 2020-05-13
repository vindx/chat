import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { ChannelList, ChannelListItem, ChannelWrapper } from './styledComponents/Channel';
import { BottomSection } from './styledComponents/SideBar';

const channel = ({ id, name, active }) => (
  <Link key={`channel-${id}`} to={`/view-channel/${id}`}>
    <ChannelListItem active={active} title={name}>
      {name.charAt(0).toUpperCase()}
    </ChannelListItem>
  </Link>
);

const Channels = ({ channels, currentChannelId, onAddChannelClick, onProfileClick }) => {
  // eslint-disable-next-line no-confusing-arrow
  const channelsWithActive = channels.map((ch) =>
    currentChannelId === ch.id ? { ...ch, active: true } : ch
  );
  return (
    <ChannelWrapper>
      <ChannelList>
        <ChannelListItem
          title="Add channel"
          bgColor="#8EEC6A"
          borderColor="#3BDA00"
          onClick={onAddChannelClick}
        >
          +
        </ChannelListItem>
        {channelsWithActive.map(channel)}
      </ChannelList>
      <BottomSection>
        <Button onClick={onProfileClick} color="instagram" compact>
          Profile
        </Button>
      </BottomSection>
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
  onProfileClick: PropTypes.func.isRequired,
};
Channels.defaultProps = {
  currentChannelId: undefined,
};

export default Channels;
