import React, { useState } from 'react';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import {
  ButtonSection,
  ChannelImage,
  ChannelInfo,
  ChannelName,
} from '../../styledComponents/UserInfo';
import ChangeChannelNameForm from './ChangeChannelNameForm';

const UserInfoChannel = ({ channel: { id, name }, viewMode }) => {
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
        <>
          <ChannelImage>{name.charAt(0).toUpperCase()}</ChannelImage>
          <ChannelName>{name.slice(1)}</ChannelName>
        </>
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
};

export default UserInfoChannel;
