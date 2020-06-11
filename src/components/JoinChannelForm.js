import React from 'react';
import { connect } from 'react-redux';
import { Button, Form, Label } from 'semantic-ui-react';
import { withFormik } from 'formik';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import PropTypes from 'prop-types';

import { joinChannelMutation } from '../graphql/channel';
import { CustomInput } from './styledComponents/GlobalStyle';
import { addChannel } from '../redux/actions';

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
      <CustomInput
        value={values.secretKey}
        onChange={handleChange}
        onBlur={handleBlur}
        name="secretKey"
        fluid
        placeholder="Secret key"
      />
      {error.message && (
        <Label color="red" pointing>
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
  connect(null, { addChannel }),
  withFormik({
    mapPropsToValues: () => ({ secretKey: '' }),
    handleSubmit: async (
      { secretKey },
      { props: { addChannel: updateChannels, onClose, mutate, history }, setSubmitting, setErrors }
    ) => {
      const response = await mutate({
        variables: { secretKey },
        update: (store, { data: { joinChannel } }) => {
          const { ok, channel, errors } = joinChannel;
          if (!ok) {
            setErrors(errors[0]);
            return;
          }
          updateChannels(channel);
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
