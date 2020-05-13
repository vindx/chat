import React from 'react';
import { Modal } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import UserInfoContainer from '../containers/UserInfoContainer';

const UserInfoModal = ({ open, onClose, history }) => (
  <Modal open={open} onClose={onClose} size="large" closeIcon>
    <UserInfoContainer history={history} />
  </Modal>
);

UserInfoModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  history: PropTypes.shape({}).isRequired,
};

export default UserInfoModal;
