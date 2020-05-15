import React from 'react';
import PropTypes from 'prop-types';

import { ChannelsInfoWrapper } from '../../styledComponents/UserInfo';
import UserInfoChannel from './UserInfoChannel';

const UserInfoChannels = ({ userId, channels, viewMode, switchChannel }) => (
  <ChannelsInfoWrapper>
    {channels.map((channel) => (
      <UserInfoChannel
        channel={channel}
        key={channel.id}
        viewMode={viewMode}
        userId={userId}
        switchChannel={switchChannel}
      />
    ))}
  </ChannelsInfoWrapper>
);

UserInfoChannels.propTypes = {
  userId: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  channels: PropTypes.array.isRequired,
  viewMode: PropTypes.bool.isRequired,
  switchChannel: PropTypes.func.isRequired,
};

export default UserInfoChannels;
