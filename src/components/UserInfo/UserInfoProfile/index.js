import React, { useState } from 'react';
import { Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import {
  ProfileImage,
  ProfileImageWrapper,
  ProfileInfoItemAttribute,
  ProfileInfoItemValue,
  ProfileInfoItemWrapper,
  ProfileInfoWrapper,
  ProfileWrapper,
} from '../../styledComponents/UserInfo';
import SignOutButton from '../../SignOutButton';
import ChangeUserNameForm from './ChangeUserNameForm';

const UserInfoProfile = ({ user: { userName = '', email = '' } = {}, viewMode, history }) => {
  const [editUserNameMode, setUserNameMode] = useState(false);

  const handleToggleUserNameMode = () => {
    setUserNameMode(!editUserNameMode);
  };

  return (
    <ProfileWrapper>
      <ProfileImageWrapper>
        <ProfileImage>{userName.charAt(0).toUpperCase()}</ProfileImage>
      </ProfileImageWrapper>
      <ProfileInfoWrapper>
        <ProfileInfoItemWrapper editMode={editUserNameMode}>
          <ProfileInfoItemAttribute>username:</ProfileInfoItemAttribute>

          {editUserNameMode ? (
            <ChangeUserNameForm oldUserName={userName} close={handleToggleUserNameMode} />
          ) : (
            <ProfileInfoItemValue>{userName}</ProfileInfoItemValue>
          )}

          {!viewMode && !editUserNameMode && (
            <Icon name="pencil" onClick={handleToggleUserNameMode} />
          )}
        </ProfileInfoItemWrapper>
        <ProfileInfoItemWrapper>
          <ProfileInfoItemAttribute>email:</ProfileInfoItemAttribute>
          <ProfileInfoItemValue>{email}</ProfileInfoItemValue>
        </ProfileInfoItemWrapper>
        {!viewMode && <SignOutButton compact floated="right" history={history} />}
      </ProfileInfoWrapper>
    </ProfileWrapper>
  );
};

UserInfoProfile.propTypes = {
  user: PropTypes.shape({}).isRequired,
  viewMode: PropTypes.bool.isRequired,
  history: PropTypes.shape({}).isRequired,
};

export default UserInfoProfile;
