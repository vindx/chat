import React from 'react';
import { Grid } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import CreateChannelForm from '../CreateChannelForm';
import JoinChannelForm from '../JoinChannelForm';
import {
  CustomDivider,
  CustomHeader,
  CustomModal,
  CustomModalContent,
  CustomSegment,
} from '../styledComponents/GlobalStyle';

const AddChannelModal = ({ isOpen, onClose, history }) => (
  <CustomModal open={isOpen} onClose={onClose} closeIcon>
    <CustomModalContent>
      <CustomSegment>
        <Grid columns={2} relaxed="very">
          <Grid.Column>
            <CustomHeader as="h3" textAlign="center">
              Create a channel!
            </CustomHeader>
            <CustomHeader as="h5" disabled textAlign="center">
              Create a new channel and invite people there
            </CustomHeader>
            <CreateChannelForm onClose={onClose} history={history} />
          </Grid.Column>
          <Grid.Column>
            <CustomHeader as="h3" textAlign="center">
              Join a channel!
            </CustomHeader>
            <CustomHeader as="h5" disabled textAlign="center">
              Join an existing channel
            </CustomHeader>
            <JoinChannelForm onClose={onClose} history={history} />
          </Grid.Column>
        </Grid>
        <CustomDivider vertical>or</CustomDivider>
      </CustomSegment>
    </CustomModalContent>
  </CustomModal>
);

AddChannelModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  history: PropTypes.shape({}).isRequired,
};

export default AddChannelModal;
