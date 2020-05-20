import React from 'react';
import { Grid, Button, Label } from 'semantic-ui-react';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import PropTypes from 'prop-types';

import {
  CustomDivider,
  CustomHeader,
  CustomModal,
  CustomModalContent,
  CustomSegment,
} from '../styledComponents/GlobalStyle';

const generateChannelKeyMutation = gql`
  mutation($channelId: ID!) {
    createChannelKey(channelId: $channelId) {
      ok
      channelKey {
        shortId
      }
      errors {
        message
      }
    }
  }
`;

const InvitePeopleModal = ({ isOpen, onClose, channelId }) => {
  const [
    generateChannelKey,
    { data: { createChannelKey: { channelKey: { shortId } = {} } = {} } = {}, loading },
  ] = useMutation(generateChannelKeyMutation);

  const handleGenerateChannelKey = async () => {
    try {
      await generateChannelKey({ variables: { channelId } });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <CustomModal open={isOpen} onClose={onClose} closeIcon>
      <CustomModalContent>
        <CustomSegment>
          <Grid columns={2} relaxed="very">
            <Grid.Column>
              <CustomHeader as="h3" textAlign="center">
                Create a secret
                <Label color="green" horizontal>
                  KEY
                </Label>
                !
              </CustomHeader>
              <CustomHeader as="h5" disabled textAlign="center">
                Click on generate button
              </CustomHeader>
              <Button
                basic
                positive
                fluid
                onClick={handleGenerateChannelKey}
                loading={loading}
                disabled={loading}
              >
                Generate
              </Button>
            </Grid.Column>
            <Grid.Column>
              <CustomHeader as="h3" textAlign="center">
                Share a
                <Label color="green" horizontal>
                  KEY
                </Label>
                !
              </CustomHeader>
              <CustomHeader as="h5" disabled textAlign="center">
                Share this key to your friends
              </CustomHeader>
              <CustomHeader as="h5" textAlign="center">
                <Label color="green" horizontal>
                  key
                </Label>
                {shortId}
              </CustomHeader>
            </Grid.Column>
          </Grid>
          <CustomDivider vertical>and</CustomDivider>
        </CustomSegment>
      </CustomModalContent>
    </CustomModal>
  );
};

InvitePeopleModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  channelId: PropTypes.string.isRequired,
};

export default InvitePeopleModal;
