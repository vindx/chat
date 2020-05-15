import React from 'react';
import prettydate from 'pretty-date';
import PropTypes from 'prop-types';

import {
  MessageInfoChannel,
  MessageInfoChannelWrapper,
  MessageInfoText,
  MessageInfoWrapper,
} from '../../styledComponents/UserInfo';
import { CreatedAt } from '../../styledComponents/Messages';

const UserInfoMessage = ({ message: { text, createdAt, channel }, switchChannel }) => (
  <MessageInfoWrapper>
    <MessageInfoText>{text}</MessageInfoText>
    <CreatedAt>{prettydate.format(new Date(Number(createdAt)))}</CreatedAt>
    <MessageInfoChannelWrapper>
      at the
      <MessageInfoChannel id={channel.id} onClick={switchChannel}>
        {channel.name}
      </MessageInfoChannel>
      channel
    </MessageInfoChannelWrapper>
  </MessageInfoWrapper>
);

UserInfoMessage.propTypes = {
  message: PropTypes.shape({
    text: PropTypes.string,
    createdAt: PropTypes.string,
    channel: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    }),
  }).isRequired,
  switchChannel: PropTypes.func.isRequired,
};

export default UserInfoMessage;
