import React from 'react';
import { Input } from 'semantic-ui-react';
import { withFormik } from 'formik';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import PropTypes from 'prop-types';

import { createMessageMutation } from '../graphql/message';

const SendMessage = ({
  channelName,
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
  enterKey,
}) => (
  <Input
    onChange={handleChange}
    onBlur={handleBlur}
    name="message"
    value={values.message}
    fluid
    placeholder={`Message #${channelName}`}
    onKeyDown={(e) => {
      if (e.keyCode === enterKey && !isSubmitting) {
        handleSubmit(e);
      }
    }}
  />
);

SendMessage.propTypes = {
  channelName: PropTypes.string.isRequired,
  values: PropTypes.shape({
    message: PropTypes.string.isRequired,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  enterKey: PropTypes.number.isRequired,
};

export default compose(
  graphql(createMessageMutation),
  withFormik({
    mapPropsToValues: () => ({ message: '' }),
    handleSubmit: async (
      { message },
      { props: { currentChannelId, mutate }, setSubmitting, setFieldValue }
    ) => {
      if (!message || !message.trim()) {
        setSubmitting(false);
        return;
      }

      await mutate({
        variables: { channelId: currentChannelId, text: message },
      });
      setSubmitting(false);
      setFieldValue('message', '');
    },
  })
)(SendMessage);
