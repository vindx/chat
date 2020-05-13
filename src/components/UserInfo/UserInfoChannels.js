import React from 'react';
import PropTypes from 'prop-types';

import {
  ChannelImage,
  ChannelInfo,
  ChannelName,
  ChannelsInfoWrapper,
} from '../styledComponents/UserInfo';

const UserInfoChannel = ({ channel: { name } }) => (
  <ChannelInfo>
    <ChannelImage>{name.charAt(0).toUpperCase()}</ChannelImage>
    <ChannelName>{name.slice(1)}</ChannelName>
  </ChannelInfo>
);

const UserInfoChannels = ({ channels }) => (
  <ChannelsInfoWrapper>
    {channels.map((channel) => (
      <UserInfoChannel channel={channel} key={channel.id} />
    ))}
  </ChannelsInfoWrapper>
);

UserInfoChannel.propTypes = {
  channel: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
};

UserInfoChannels.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  channels: PropTypes.array.isRequired,
};

export default UserInfoChannels;
