import React, { useCallback, useRef } from 'react';
import PropTypes from 'prop-types';

import { ChannelsInfoWrapper } from '../../styledComponents/UserInfo';
import UserInfoChannel from './UserInfoChannel';

const UserInfoChannels = ({ userId, channels, viewMode, switchChannel, fetchMoreChannels }) => {
  const observer = useRef();
  const lastChannelElementRef = useCallback(
    (node) => {
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchMoreChannels({
            variables: {
              id: userId,
              offset: channels.length,
              // limit - default value 10 (on server)
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              if (!fetchMoreResult) return prev;
              return {
                ...prev,
                getUser: {
                  ...prev.getUser,
                  channels: [...prev.getUser.channels, ...fetchMoreResult.getUser.channels],
                },
              };
            },
          });
        }
      });
      if (node) observer.current.observe(node);
    },
    [channels, fetchMoreChannels, userId]
  );

  return (
    <ChannelsInfoWrapper>
      {channels.map((channel, index) => (
        <UserInfoChannel
          refLink={index === channels.length - 3 ? lastChannelElementRef : null}
          channel={channel}
          key={channel.id}
          viewMode={viewMode}
          userId={userId}
          switchChannel={switchChannel}
        />
      ))}
    </ChannelsInfoWrapper>
  );
};

UserInfoChannels.propTypes = {
  userId: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  channels: PropTypes.array.isRequired,
  viewMode: PropTypes.bool.isRequired,
  switchChannel: PropTypes.func.isRequired,
  fetchMoreChannels: PropTypes.func.isRequired,
};

export default UserInfoChannels;
