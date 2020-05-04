import React from 'react';
import styled from 'styled-components';
import { Button, Input } from 'semantic-ui-react';
import { withFormik } from 'formik';
import { gql } from 'apollo-boost';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import PropTypes from 'prop-types';

import FileUpload from './FileUpload';

const SendMessageWrapper = styled.div`
  grid-column: 3;
  grid-row: 3;
  margin: 20px;
  display: grid;
  grid-template-columns: 0.01fr 1fr;
`;

const ENTER_KEY = 13;

const SendMessage = ({
  channelName,
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
  currentChannelId,
}) =>
  channelName && (
    <SendMessageWrapper>
      <FileUpload channelId={currentChannelId}>
        <Button icon="upload" />
      </FileUpload>
      <Input
        onChange={handleChange}
        onBlur={handleBlur}
        name="message"
        value={values.message}
        fluid
        placeholder={`Message #${channelName}`}
        onKeyDown={(e) => {
          if (e.keyCode === ENTER_KEY && !isSubmitting) {
            handleSubmit(e);
          }
        }}
      />
    </SendMessageWrapper>
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
  currentChannelId: PropTypes.string,
};
SendMessage.defaultProps = {
  currentChannelId: undefined,
};

const createMessageMutation = gql`
  mutation($channelId: ID!, $text: String!) {
    createMessage(channelId: $channelId, text: $text) {
      id
      text
    }
  }
`;

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
