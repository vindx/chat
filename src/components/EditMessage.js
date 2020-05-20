import React, { useEffect } from 'react';
import { Button, Form } from 'semantic-ui-react';
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
import { CustomTextArea } from './styledComponents/GlobalStyle';

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
  emoji,
}) => {
  useEffect(() => {
    // eslint-disable-next-line no-param-reassign
    values.message += emoji.colons;
  }, [emoji]);

  return [
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
        <CustomTextArea
          autoFocus
          /* eslint-disable-next-line no-return-assign */
          onFocus={({ target }) => {
            // eslint-disable-next-line no-param-reassign
            target.selectionStart = values.message.length;
          }}
          rows={
            /* automatic update rows counter depend of window's width
             * 0.8 means that input ≈ 80% of window's width
             * 7.7 means that letter width ≈ 7.7px
             * on big and small screens that might work not perfect
             * cause 0.8 and 7.7 just approximate values */
            (values.message.length + (window.innerWidth * 0.8) / 7.7)
            / ((window.innerWidth * 0.8) / 7.7)
          }
          onChange={handleChange}
          onBlur={handleBlur}
          name="message"
          value={values.message}
          placeholder="Edit message"
          onKeyDown={(e) => {
            if (e.keyCode === enterKey && !isSubmitting) {
              if (messageForEditing === values.message) {
                close();
                return;
              }
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
};

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
      { props: { currentChannelId, messageId, mutate, close, setLastMessageSent }, setSubmitting }
    ) => {
      if (!message || !message.trim()) {
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
