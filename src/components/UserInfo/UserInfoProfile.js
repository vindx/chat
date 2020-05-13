import React from 'react';
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
} from '../styledComponents/UserInfo';
import SignOutButton from '../SignOutButton';

const UserInfoProfile = ({ user: { userName = '', email = '' } = {}, viewMode, history }) => (
  <ProfileWrapper>
    <ProfileImageWrapper>
      <ProfileImage>{userName.charAt(0).toUpperCase()}</ProfileImage>
    </ProfileImageWrapper>
    <ProfileInfoWrapper>
      <ProfileInfoItemWrapper>
        <ProfileInfoItemAttribute>username:</ProfileInfoItemAttribute>
        <ProfileInfoItemValue>{userName}</ProfileInfoItemValue>
        {!viewMode && <Icon name="pencil" onClick={() => console.log('edit1')} />}
      </ProfileInfoItemWrapper>
      <ProfileInfoItemWrapper>
        <ProfileInfoItemAttribute>email:</ProfileInfoItemAttribute>
        <ProfileInfoItemValue>{email}</ProfileInfoItemValue>
      </ProfileInfoItemWrapper>
      {!viewMode && <SignOutButton compact floated="right" history={history} />}
    </ProfileInfoWrapper>
  </ProfileWrapper>
);

UserInfoProfile.propTypes = {
  user: PropTypes.shape({}).isRequired,
  viewMode: PropTypes.bool.isRequired,
  history: PropTypes.shape({}).isRequired,
};

export default UserInfoProfile;
