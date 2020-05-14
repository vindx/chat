import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Dimmer, Loader, Menu } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { getUserQuery } from '../graphql/user';
import UserInfoProfile from '../components/UserInfo/UserInfoProfile';
import UserInfoChannels from '../components/UserInfo/UserInfoChannels';
import UserInfoMessages from '../components/UserInfo/UserInfoMessages';

const UserInfoContainer = ({ userId = '', history }) => {
  const {
    data: { getUser: { userName, email, channels, messages } = {} } = {},
    loading,
  } = useQuery(getUserQuery, { fetchPolicy: 'network-only' });

  const [activeItem, setActiveItem] = useState('profile');
  const handleItemClick = (e, { name }) => setActiveItem(name);

  useEffect(() => {
    handleItemClick('', { name: 'profile' });
  }, [userId]);

  return (
    <div>
      <Menu pointing>
        <Menu.Item name="profile" active={activeItem === 'profile'} onClick={handleItemClick} />
        <Menu.Item name="channels" active={activeItem === 'channels'} onClick={handleItemClick} />
        <Menu.Item name="messages" active={activeItem === 'messages'} onClick={handleItemClick} />
      </Menu>
      {loading ? (
        <Dimmer active inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
      ) : (
        <>
          {activeItem === 'profile' && (
            <UserInfoProfile viewMode={false} user={{ userName, email }} history={history} />
          )}
          {activeItem === 'channels' && <UserInfoChannels channels={channels} />}
          {activeItem === 'messages' && <UserInfoMessages messages={messages} />}
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
