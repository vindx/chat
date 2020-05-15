import React from 'react';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import { withFormik } from 'formik';
import { Icon, Input, Label } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { editChannelNameMutation } from '../../../graphql/channel';

const ChangeChannelNameForm = ({
  handleSubmit,
  handleChange,
  handleBlur,
  values,
  isSubmitting,
  close,
  oldChannelName,
  errors: error,
}) => (
  <>
    <Input
      autoComplete="off"
      size="small"
      name="newChannelName"
      onChange={handleChange}
      onBlur={handleBlur}
      value={values.newChannelName}
      loading={isSubmitting}
      disabled={isSubmitting}
      error={!!error.message}
      onKeyDown={(e) => {
        if (e.keyCode === 13 && !isSubmitting) {
          if (oldChannelName === values.newChannelName) {
            close();
            return;
          }
          handleSubmit(e);
        }
        if (e.keyCode === 27 && !isSubmitting) {
          close();
        }
      }}
    />
    <Icon
      name="check"
      onClick={() => {
        if (oldChannelName === values.newChannelName) {
          close();
          return;
        }
        handleSubmit();
      }}
    />
    <Icon name="close" onClick={close} />
    {error.message && (
      <Label basic color="red">
        {error.message}
      </Label>
    )}
  </>
);

ChangeChannelNameForm.propTypes = {
  values: PropTypes.shape({
    newChannelName: PropTypes.string.isRequired,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  oldChannelName: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
  errors: PropTypes.shape({}).isRequired,
};

export default compose(
  graphql(editChannelNameMutation),
  withFormik({
    mapPropsToValues: ({ oldChannelName }) => ({ newChannelName: oldChannelName }),
    enableReinitialize: true,
    handleSubmit: async (
      { newChannelName },
      { props: { mutate, close, channelId }, setSubmitting, setErrors }
    ) => {
      if (!newChannelName || !newChannelName.trim()) {
        setSubmitting(false);
        return;
      }
      await mutate({
        variables: { channelId, channelName: newChannelName },
        update: (store, { data: { editChannelName } }) => {
          const { ok, errors } = editChannelName;
          if (!ok) {
            setErrors(errors[0]);
            return;
          }
          setSubmitting(false);
          close();
        },
      });
    },
  })
)(ChangeChannelNameForm);
