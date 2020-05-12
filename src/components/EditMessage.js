import React from 'react';
import { Button, Form, TextArea } from 'semantic-ui-react';
import { withFormik } from 'formik';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import PropTypes from 'prop-types';

import {
  EditMessageBody,
  EditMessageButton,
  EditMessageContainer,
  EditMessageHeader,
  EditMessageText,
  EditMessageWrapper,
} from './styledComponents/EditMessage';
import { editMessageMutation } from '../graphql/message';
import { ButtonsWrapper } from './styledComponents/SendMessage';

const ESC_KEY = 27;

const EditMessage = ({
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
  messageForEditing,
  close,
  enterKey,
}) => [
  <EditMessageContainer key="edit-message-container">
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
        autoFocus
        /* eslint-disable-next-line no-return-assign */
        onFocus={({ target }) => {
          // eslint-disable-next-line no-param-reassign
          target.selectionStart = values.message.length;
        }}
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
          if (e.keyCode === ESC_KEY && !isSubmitting) {
            close();
          }
        }}
      />
    </Form>
  </EditMessageContainer>,
  <ButtonsWrapper key="buttons-wrapper">
    <Button onClick={handleSubmit} type="submit" compact color="instagram" loading={isSubmitting}>
      Edit
    </Button>
  </ButtonsWrapper>,
];

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
      {
        props: {
          messageForEditing,
          currentChannelId,
          messageId,
          mutate,
          close,
          setLastMessageSent,
        },
        setSubmitting,
      }
    ) => {
      if (!message || !message.trim() || messageForEditing === message) {
        setSubmitting(false);
        return;
      }

      await mutate({
        variables: { channelId: currentChannelId, text: message, messageId },
      });
      setSubmitting(false);
      setLastMessageSent(message, messageId);
      close();
    },
  })
)(EditMessage);
