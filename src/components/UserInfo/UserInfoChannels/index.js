import React from 'react';
import PropTypes from 'prop-types';

import { ChannelsInfoWrapper } from '../../styledComponents/UserInfo';
import UserInfoChannel from './UserInfoChannel';

const UserInfoChannels = ({ userId, channels, viewMode }) => (
  <ChannelsInfoWrapper>
    {channels.map((channel) => (
      <UserInfoChannel channel={channel} key={channel.id} viewMode={viewMode} userId={userId} />
    ))}
  </ChannelsInfoWrapper>
);

UserInfoChannels.propTypes = {
  userId: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  channels: PropTypes.array.isRequired,
  viewMode: PropTypes.bool.isRequired,
};

export default UserInfoChannels;
