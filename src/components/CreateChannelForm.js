import React from 'react';
import { Button, Form, Input, Label } from 'semantic-ui-react';
import { withFormik } from 'formik';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import PropTypes from 'prop-types';

import { allChannelsQuery, createChannelMutation } from '../graphql/channel';

const createChannelForm = ({
  values,
  handleChange,
  handleBlur,
  isSubmitting,
  handleSubmit,
  errors: error,
}) => (
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
      {error.message && (
        <Label basic color="red" pointing>
          {error.message}
        </Label>
      )}
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
  errors: PropTypes.shape({}).isRequired,
};

export default compose(
  graphql(createChannelMutation),
  withFormik({
    mapPropsToValues: () => ({ channelName: '' }),
    handleSubmit: async (
      { channelName },
      { props: { onClose, mutate, history }, setSubmitting, setErrors }
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
          const { ok, channel, errors } = createChannel;
          if (!ok) {
            setErrors(errors[0]);
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
