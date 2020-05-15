import React, { useState } from 'react';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import {
  ButtonSection,
  ChannelInfo,
  ChannelName,
  ChannelNameFirstLetter,
  ChannelNameRemainingLetters,
} from '../../styledComponents/UserInfo';
import ChangeChannelNameForm from './ChangeChannelNameForm';

const UserInfoChannel = ({ channel: { id, name }, viewMode, switchChannel }) => {
  const [editChannelNameMode, setEditChannelNameMode] = useState(false);

  const handleToggleChannelNameMode = () => {
    setEditChannelNameMode(!editChannelNameMode);
  };

  return (
    <ChannelInfo>
      {editChannelNameMode ? (
        <ChangeChannelNameForm
          close={handleToggleChannelNameMode}
          channelId={id}
          oldChannelName={name}
        />
      ) : (
        <ChannelName id={id} onClick={switchChannel}>
          <ChannelNameFirstLetter>{name.charAt(0).toUpperCase()}</ChannelNameFirstLetter>
          <ChannelNameRemainingLetters>{name.slice(1)}</ChannelNameRemainingLetters>
        </ChannelName>
      )}
      {!viewMode && !editChannelNameMode && (
        <ButtonSection>
          <Button basic size="mini" compact color="blue" onClick={handleToggleChannelNameMode}>
            Edit
          </Button>
        </ButtonSection>
      )}
    </ChannelInfo>
  );
};

UserInfoChannel.propTypes = {
  channel: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  viewMode: PropTypes.bool.isRequired,
  switchChannel: PropTypes.func.isRequired,
};

export default UserInfoChannel;
