import React, { useState } from 'react';
import { Button, Icon } from 'semantic-ui-react';
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
import ChangePasswordForm from './ChangePasswordForm';

const UserInfoProfile = ({ user: { userName = '', email = '' } = {}, viewMode, history }) => {
  const [editUserNameMode, setEditUserNameMode] = useState(false);
  const [editPasswordMode, setEditPasswordMode] = useState(false);

  const handleToggleUserNameMode = () => {
    setEditUserNameMode(!editUserNameMode);
  };

  const handleTogglePasswordMode = () => {
    setEditPasswordMode(!editPasswordMode);
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
        <ProfileInfoItemWrapper>
          {editPasswordMode && <ChangePasswordForm close={handleTogglePasswordMode} />}
          <Button size="tiny" compact basic onClick={handleTogglePasswordMode}>
            {editPasswordMode ? 'Close' : 'Change password'}
          </Button>
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
