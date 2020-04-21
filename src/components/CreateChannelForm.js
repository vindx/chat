import React from 'react';
import { Button, Form, Input } from 'semantic-ui-react';
import { withFormik } from 'formik';
import { gql } from 'apollo-boost';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import PropTypes from 'prop-types';

const createChannelForm = ({
  values,
  handleChange,
  handleBlur,
  isSubmitting,
  handleSubmit,
  ...props
}) => {
  console.log(props);
  return (
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
        <Button color="blue" fluid disabled={isSubmitting} loading={isSubmitting} type="submit">
          Create Channel
        </Button>
      </Form.Field>
    </Form>
  );
};

createChannelForm.propTypes = {
  values: PropTypes.shape({
    channelName: PropTypes.string.isRequired,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

const createChannelMutation = gql`
  mutation($name: String!) {
    createChannel(name: $name) {
      ok
      channel {
        id
      }
      errors {
        path
        type
        message
      }
    }
  }
`;

export default compose(
  graphql(createChannelMutation),
  withFormik({
    mapPropsToValues: () => ({ channelName: '' }),
    handleSubmit: async ({ channelName }, { props: { onClose, mutate }, setSubmitting }) => {
      const response = await mutate({ variables: { name: channelName } });
      console.log(response);
      setSubmitting(false);
      onClose();
    },
  })
)(createChannelForm);
