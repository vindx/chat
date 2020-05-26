import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Dimmer, Loader } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { getUserQuery } from '../graphql/user';
import UserInfoProfile from '../components/UserInfo/UserInfoProfile';
import UserInfoChannels from '../components/UserInfo/UserInfoChannels';
import UserInfoMessages from '../components/UserInfo/UserInfoMessages';
import setViewModeStatus from '../helpers/setViewModeStatus';
import switchChannelById from '../helpers/switchChannelById';
import { UserInfoWrapper } from '../components/styledComponents/UserInfo';
import { CustomMenu, CustomMenuItem } from '../components/styledComponents/GlobalStyle';

const UserInfoContainer = ({ userId = '', history }) => {
  const {
    data: { getUser: { userName, email, channels, messages } = {} } = {},
    loading,
    fetchMore,
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
    <UserInfoWrapper>
      <CustomMenu pointing>
        <CustomMenuItem
          name="profile"
          active={activeItem === 'profile'}
          onClick={handleItemClick}
        />
        <CustomMenuItem
          name="channels"
          active={activeItem === 'channels'}
          onClick={handleItemClick}
        />
        {!viewMode && (
          <CustomMenuItem
            name="messages"
            active={activeItem === 'messages'}
            onClick={handleItemClick}
          />
        )}
      </CustomMenu>
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
              fetchMoreChannels={fetchMore}
            />
          )}
          {!viewMode && activeItem === 'messages' && (
            <UserInfoMessages
              messages={messages}
              userId={userId}
              switchChannel={handleSwitchChannel}
              fetchMoreMessages={fetchMore}
            />
          )}
        </>
      )}
    </UserInfoWrapper>
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
