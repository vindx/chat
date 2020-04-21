import React from 'react';
import { Button, Form, Input } from 'semantic-ui-react';
import { withFormik } from 'formik';
import PropTypes from 'prop-types';

const joinChannelForm = ({ values, handleChange, handleBlur, isSubmitting, handleSubmit }) => (
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
    </Form.Field>
    <Form.Field>
      <Button color="orange" fluid disabled={isSubmitting} type="submit">
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
};

export default withFormik({
  mapPropsToValues: () => ({ secretKey: '' }),
  handleSubmit: (values, { setSubmitting }) => {
    console.log('submitting', values);
    setSubmitting(false);
  },
})(joinChannelForm);
