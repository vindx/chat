import React from 'react';
import { Button, Form, TextArea } from 'semantic-ui-react';
import { withFormik } from 'formik';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import PropTypes from 'prop-types';

import {
  EditMessageBody,
  EditMessageButton,
  EditMessageHeader,
  EditMessageText,
  EditMessageWrapper,
} from './styledComponents/EditMessage';
import { editMessageMutation } from '../graphql/message';

const EditMessage = ({
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
  messageForEditing,
  close,
  enterKey,
}) => (
  <>
    <EditMessageWrapper>
      <EditMessageBody>
        <EditMessageHeader>Edit message</EditMessageHeader>
        <EditMessageText>{messageForEditing}</EditMessageText>
      </EditMessageBody>
      <EditMessageButton>
        <Button icon="cancel" basic size="mini" circular color="yellow" onClick={close} />
      </EditMessageButton>
    </EditMessageWrapper>
    <Form>
      <TextArea
        rows={(messageForEditing.length + 150) / 150}
        onChange={handleChange}
        onBlur={handleBlur}
        name="message"
        value={values.message}
        placeholder="Message"
        onKeyDown={(e) => {
          if (e.keyCode === enterKey && !isSubmitting) {
            handleSubmit(e);
          }
        }}
      />
    </Form>
  </>
);

EditMessage.propTypes = {
  values: PropTypes.shape({
    message: PropTypes.string.isRequired,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  messageForEditing: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
  enterKey: PropTypes.number.isRequired,
};

export default compose(
  graphql(editMessageMutation),
  withFormik({
    mapPropsToValues: ({ messageForEditing }) => ({ message: messageForEditing }),
    enableReinitialize: true,
    handleSubmit: async (
      { message },
      { props: { messageForEditing, currentChannelId, messageId, mutate, close }, setSubmitting }
    ) => {
      if (!message || !message.trim() || messageForEditing === message) {
        setSubmitting(false);
        return;
      }

      await mutate({
        variables: { channelId: currentChannelId, text: message, messageId },
      });
      setSubmitting(false);
      close();
    },
  })
)(EditMessage);
