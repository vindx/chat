import React from 'react';
import PropTypes from 'prop-types';

import UserInfoContainer from '../../containers/UserInfoContainer';
import { CustomModal } from '../styledComponents/GlobalStyle';

const UserInfoModal = ({ open, onClose, history, userId }) => (
  <CustomModal open={open} onClose={onClose} size="large" closeIcon>
    <UserInfoContainer history={history} userId={userId} />
  </CustomModal>
);

UserInfoModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  history: PropTypes.shape({}).isRequired,
  userId: PropTypes.string,
};
UserInfoModal.defaultProps = {
  userId: '',
};

export default UserInfoModal;
