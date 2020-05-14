import React from 'react';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import { withFormik } from 'formik';
import { Icon, Input, Label } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { editUserNameMutation } from '../../../graphql/user';

const ChangeUserNameForm = ({
  handleSubmit,
  handleChange,
  handleBlur,
  values,
  isSubmitting,
  close,
  oldUserName,
  errors: error,
}) => (
  <>
    <Input
      autoComplete="off"
      size="small"
      name="newUserName"
      onChange={handleChange}
      onBlur={handleBlur}
      value={values.newUserName}
      loading={isSubmitting}
      disabled={isSubmitting}
      error={!!error.message}
      onKeyDown={(e) => {
        if (e.keyCode === 13 && !isSubmitting) {
          if (oldUserName === values.newUserName) {
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
        if (oldUserName === values.newUserName) {
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

ChangeUserNameForm.propTypes = {
  values: PropTypes.shape({
    newUserName: PropTypes.string.isRequired,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  oldUserName: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
  errors: PropTypes.shape({}).isRequired,
};

export default compose(
  graphql(editUserNameMutation),
  withFormik({
    mapPropsToValues: ({ oldUserName }) => ({ newUserName: oldUserName }),
    enableReinitialize: true,
    handleSubmit: async (
      { newUserName },
      { props: { mutate, close }, setSubmitting, setErrors }
    ) => {
      if (!newUserName || !newUserName.trim()) {
        setSubmitting(false);
        return;
      }
      await mutate({
        variables: { newUserName },
        update: (store, { data: { editUserName } }) => {
          const { ok, errors } = editUserName;
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
)(ChangeUserNameForm);
