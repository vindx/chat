import React from 'react';
import { Button, Form, Input } from 'semantic-ui-react';
import { withFormik } from 'formik';
import { gql } from 'apollo-boost';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import PropTypes from 'prop-types';

import { allChannelsQuery } from '../graphql/channel';

const createChannelForm = ({ values, handleChange, handleBlur, isSubmitting, handleSubmit }) => (
  <Form onSubmit={handleSubmit}>
    <Form.Field>
      <Input
        value={values.channelName}
        onChange={handleChange}
        onBlur={handleBlur}
        name="channelName"
        fluid
        placeholder="Channel name"
      />
    </Form.Field>
    <Form.Field>
      <Button color="blue" fluid disabled={isSubmitting} loading={isSubmitting} type="submit">
        Create Channel
      </Button>
    </Form.Field>
  </Form>
);

createChannelForm.propTypes = {
  values: PropTypes.shape({
    channelName: PropTypes.string.isRequired,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

const createChannelMutation = gql`
  mutation($name: String!) {
    createChannel(name: $name) {
      ok
      channel {
        id
        name
      }
      errors {
        path
        type
        message
      }
    }
  }
`;

export default compose(
  graphql(createChannelMutation),
  withFormik({
    mapPropsToValues: () => ({ channelName: '' }),
    handleSubmit: async (
      { channelName },
      { props: { onClose, mutate, history }, setSubmitting }
    ) => {
      const response = await mutate({
        variables: { name: channelName },
        optimisticResponse: {
          __typename: 'Mutation',
          createChannel: {
            ok: true,
            channel: {
              id: -1,
              name: channelName,
              __typename: 'Channel',
            },
            errors: null,
            __typename: 'createChannel',
          },
        },
        update: (store, { data: { createChannel } }) => {
          const { ok, channel } = createChannel;
          if (!ok) {
            return;
          }
          const data = store.readQuery({ query: allChannelsQuery });
          data.getAllChannels.push(channel);
          store.writeQuery({ query: allChannelsQuery, data });
        },
      });
      const {
        data: {
          createChannel: { ok, channel },
        },
      } = response;
      if (ok) {
        history.push(`/view-channel/${channel.id}`);
        setSubmitting(false);
        onClose();
      }
    },
  })
)(createChannelForm);
