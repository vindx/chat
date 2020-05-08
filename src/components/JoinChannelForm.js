import React from 'react';
import { Button, Form, Input, Label } from 'semantic-ui-react';
import { withFormik } from 'formik';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import PropTypes from 'prop-types';

import { allChannelsQuery, joinChannelMutation } from '../graphql/channel';

const joinChannelForm = ({
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
        value={values.secretKey}
        onChange={handleChange}
        onBlur={handleBlur}
        name="secretKey"
        fluid
        placeholder="Secret key"
      />
      {error.message && (
        <Label basic color="red" pointing>
          {error.message}
        </Label>
      )}
    </Form.Field>
    <Form.Field>
      <Button color="orange" fluid disabled={isSubmitting} loading={isSubmitting} type="submit">
        Join Channel
      </Button>
    </Form.Field>
  </Form>
);

joinChannelForm.propTypes = {
  values: PropTypes.shape({
    secretKey: PropTypes.string.isRequired,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  errors: PropTypes.shape({}).isRequired,
};

export default compose(
  graphql(joinChannelMutation),
  withFormik({
    mapPropsToValues: () => ({ secretKey: '' }),
    handleSubmit: async (
      { secretKey },
      { props: { onClose, mutate, history }, setSubmitting, setErrors }
    ) => {
      const response = await mutate({
        variables: { secretKey },
        update: (store, { data: { joinChannel } }) => {
          const { ok, channel, errors } = joinChannel;
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
          joinChannel: { ok, channel },
        },
      } = response;
      if (ok) {
        history.push(`/view-channel/${channel.id}`);
        setSubmitting(false);
        onClose();
      }
    },
  })
)(joinChannelForm);
