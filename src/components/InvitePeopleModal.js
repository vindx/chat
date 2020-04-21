import React from 'react';
import { Header, Modal, Segment, Grid, Divider, Button, Label } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const InvitePeopleModal = ({ isOpen, onClose }) => (
  <Modal open={isOpen} onClose={onClose} closeIcon>
    <Modal.Content>
      <Segment>
        <Grid columns={2} relaxed="very">
          <Grid.Row centered>
            <Grid.Column verticalAlign="middle">
              <Header as="h2" textAlign="center">
                Create a secret
                <Label color="green" horizontal>
                  KEY
                </Label>
                !
              </Header>
            </Grid.Column>
            <Grid.Column>
              <Header as="h5" disabled textAlign="center">
                Click on generate button
              </Header>
              <Button basic positive fluid>
                Generate
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Divider horizontal>and</Divider>
        <Grid columns={2} relaxed="very">
          <Grid.Row centered>
            <Grid.Column verticalAlign="middle">
              <Header as="h2" textAlign="center">
                Share a
                <Label color="green" horizontal>
                  KEY
                </Label>
                !
              </Header>
            </Grid.Column>
            <Grid.Column>
              <Header as="h5" disabled textAlign="center">
                Share this key to your friends
              </Header>
              <Header as="h5" textAlign="center">
                8aiI38IA
              </Header>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </Modal.Content>
  </Modal>
);

InvitePeopleModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default InvitePeopleModal;
