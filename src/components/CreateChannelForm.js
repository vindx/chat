import React from 'react';
import { Button, Form, Input } from 'semantic-ui-react';
import { withFormik } from 'formik';
import PropTypes from 'prop-types';

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
      <Button color="blue" fluid disabled={isSubmitting} type="submit">
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

export default withFormik({
  mapPropsToValues: () => ({ channelName: '' }),
  handleSubmit: (values, { setSubmitting }) => {
    console.log('submitting', values);
    setSubmitting(false);
  },
})(createChannelForm);
