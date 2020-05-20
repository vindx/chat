import React from 'react';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import { withFormik } from 'formik';
import { Button, Form, Label } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { editPasswordMutation } from '../../../graphql/user';
import { CustomInput } from '../../styledComponents/GlobalStyle';

const ChangePasswordForm = ({
  handleSubmit,
  handleChange,
  handleBlur,
  values,
  isSubmitting,
  close,
  errors: error,
}) => (
  <Form>
    <Form.Field>
      <CustomInput
        autoComplete="off"
        size="small"
        name="oldPassword"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.oldPassword}
        disabled={isSubmitting}
        type="password"
        icon="key"
        placeholder="Enter actual password"
        onKeyDown={(e) => {
          if (e.keyCode === 13 && !isSubmitting) {
            handleSubmit(e);
          }
          if (e.keyCode === 27 && !isSubmitting) {
            close();
          }
        }}
      />
    </Form.Field>
    <Form.Field>
      <CustomInput
        autoComplete="off"
        size="small"
        name="newPassword"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.newPassword}
        disabled={isSubmitting}
        type="password"
        placeholder="Enter new password"
        onKeyDown={(e) => {
          if (e.keyCode === 13 && !isSubmitting) {
            handleSubmit(e);
          }
          if (e.keyCode === 27 && !isSubmitting) {
            close();
          }
        }}
      />
    </Form.Field>
    <Form.Field>
      <CustomInput
        autoComplete="off"
        size="small"
        name="newPasswordAgain"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.newPasswordAgain}
        disabled={isSubmitting}
        type="password"
        placeholder="Repeat new password"
        onKeyDown={(e) => {
          if (e.keyCode === 13 && !isSubmitting) {
            handleSubmit(e);
          }
          if (e.keyCode === 27 && !isSubmitting) {
            close();
          }
        }}
      />
    </Form.Field>
    <Button
      type="submit"
      color="grey"
      size="tiny"
      compact
      basic
      loading={isSubmitting}
      onClick={handleSubmit}
    >
      Submit
    </Button>
    {error.message && (
      <Label basic color="red">
        {error.message}
      </Label>
    )}
  </Form>
);

ChangePasswordForm.propTypes = {
  values: PropTypes.shape({
    oldPassword: PropTypes.string.isRequired,
    newPassword: PropTypes.string.isRequired,
    newPasswordAgain: PropTypes.string.isRequired,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  errors: PropTypes.shape({}).isRequired,
};

export default compose(
  graphql(editPasswordMutation),
  withFormik({
    mapPropsToValues: () => ({ oldPassword: '', newPassword: '', newPasswordAgain: '' }),
    enableReinitialize: true,
    handleSubmit: async (
      { oldPassword, newPassword, newPasswordAgain },
      { props: { mutate, close }, setSubmitting, setErrors }
    ) => {
      if (
        !oldPassword
        || !oldPassword.trim()
        || !newPassword
        || !newPassword.trim()
        || !newPasswordAgain
        || !newPasswordAgain.trim()
      ) {
        setSubmitting(false);
        return;
      }
      if (newPassword !== newPasswordAgain) {
        setSubmitting(false);
        setErrors({ message: 'Repeated password is not equal' });
        return;
      }
      await mutate({
        variables: { oldPassword, newPassword },
        update: (store, { data: { editPassword } }) => {
          const { ok, errors, token, refreshToken } = editPassword;
          if (!ok) {
            setErrors(errors[0]);
            return;
          }
          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', refreshToken);
          setSubmitting(false);
          close();
        },
      });
    },
  })
)(ChangePasswordForm);
