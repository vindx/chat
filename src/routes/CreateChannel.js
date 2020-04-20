import React, { useState } from 'react';
import { Form, Button, Container, Header, Input, Message } from 'semantic-ui-react';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import PropTypes from 'prop-types';

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

const CreateChannel = (props) => {
  const [createChannel, { loading }] = useMutation(createChannelMutation);
  const [data, setData] = useState({
    channelName: '',
    channelNameError: '',
  });
  const { channelName, channelNameError } = data;

  const handleChangeData = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value, [`${name}Error`]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let response = null;
    try {
      response = await createChannel({ variables: { name: channelName } });
      const {
        ok,
        channel: { id },
        errors,
      } = response.data.createChannel;

      if (ok) {
        props.history.push(`/view-channel/${id}`);
      } else {
        const err = errors.reduce((acc, { path, message }) => {
          acc[`${path}Error`] = message;
          return acc;
        }, {});
        setData({ ...data, ...err });
      }
    } catch (err) {
      console.log(err);
      props.history.push('/login');
    }
  };

  return (
    <Container text>
      <Header as="h2">Create a channel</Header>
      <Form onSubmit={handleSubmit}>
        <Form.Field error={!!channelNameError}>
          <Input
            fluid
            placeholder="Enter channel name"
            name="channelName"
            value={channelName}
            onChange={handleChangeData}
          />
        </Form.Field>
        <Button negative={!!channelNameError} loading={loading} compact>
          Submit
        </Button>
      </Form>
      {channelNameError && (
        <Message
          error
          header="There was some errors with your submission"
          list={[channelNameError]}
        />
      )}
    </Container>
  );
};

CreateChannel.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default CreateChannel;
