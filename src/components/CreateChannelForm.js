import React from 'react';
import { connect } from 'react-redux';
import { Button, Form, Label } from 'semantic-ui-react';
import { withFormik } from 'formik';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import PropTypes from 'prop-types';

import { createChannelMutation } from '../graphql/channel';
import { CustomInput } from './styledComponents/GlobalStyle';
import { addChannel } from '../redux/actions';

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
      <CustomInput
        value={values.channelName}
        onChange={handleChange}
        onBlur={handleBlur}
        name="channelName"
        fluid
        placeholder="Channel name"
      />
      {error.message && (
        <Label color="red" pointing>
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
  connect(null, { addChannel }),
  withFormik({
    mapPropsToValues: () => ({ channelName: '' }),
    handleSubmit: async (
      { channelName },
      { props: { addChannel: updateChannels, onClose, mutate, history }, setSubmitting, setErrors }
    ) => {
      const response = await mutate({
        variables: { name: channelName },
        update: (store, { data: { createChannel } }) => {
          const { ok, channel, errors } = createChannel;
          if (!ok) {
            setErrors(errors[0]);
            return;
          }
          updateChannels(channel);
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
