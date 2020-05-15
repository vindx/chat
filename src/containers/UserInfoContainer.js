import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Dimmer, Loader, Menu } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { getUserQuery } from '../graphql/user';
import UserInfoProfile from '../components/UserInfo/UserInfoProfile';
import UserInfoChannels from '../components/UserInfo/UserInfoChannels';
import UserInfoMessages from '../components/UserInfo/UserInfoMessages';
import setViewModeStatus from '../helpers/setViewModeStatus';
import switchChannelById from '../helpers/switchChannelById';

const UserInfoContainer = ({ userId = '', history }) => {
  const {
    data: { getUser: { userName, email, channels, messages } = {} } = {},
    loading,
  } = useQuery(getUserQuery, { variables: { id: userId }, fetchPolicy: 'network-only' });

  const [activeItem, setActiveItem] = useState('profile');
  const handleItemClick = (e, { name }) => setActiveItem(name);

  useEffect(() => {
    handleItemClick('', { name: 'profile' });
  }, [userId]);

  const viewMode = setViewModeStatus(userId);

  const handleSwitchChannel = (e) => {
    switchChannelById(e.currentTarget.id, history);
  };

  return (
    <div>
      <Menu pointing>
        <Menu.Item name="profile" active={activeItem === 'profile'} onClick={handleItemClick} />
        <Menu.Item name="channels" active={activeItem === 'channels'} onClick={handleItemClick} />
        {!viewMode && (
          <Menu.Item name="messages" active={activeItem === 'messages'} onClick={handleItemClick} />
        )}
      </Menu>
      {loading ? (
        <Dimmer active inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
      ) : (
        <>
          {activeItem === 'profile' && (
            <UserInfoProfile viewMode={viewMode} user={{ userName, email }} history={history} />
          )}
          {activeItem === 'channels' && (
            <UserInfoChannels
              viewMode={viewMode}
              channels={channels}
              history={history}
              userId={userId}
              switchChannel={handleSwitchChannel}
            />
          )}
          {!viewMode && activeItem === 'messages' && (
            <UserInfoMessages messages={messages} switchChannel={handleSwitchChannel} />
          )}
        </>
      )}
    </div>
  );
};

UserInfoContainer.propTypes = {
  userId: PropTypes.string,
  history: PropTypes.shape({}).isRequired,
};
UserInfoContainer.defaultProps = {
  userId: '',
};

export default UserInfoContainer;
