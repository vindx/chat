import React, { useEffect } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { withFormik } from 'formik';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import PropTypes from 'prop-types';

import { createMessageMutation } from '../graphql/message';
import { ButtonsWrapper } from './styledComponents/SendMessage';
import { CustomTextArea } from './styledComponents/GlobalStyle';

const ARROW_UP_KEY = 38;

const SendMessage = ({
  channelName,
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
  enterKey,
  startEditing,
  emoji,
  SetMessageWithEmoji,
}) => {
  useEffect(() => {
    SetMessageWithEmoji(`${values.message}${emoji.colons}`);
  }, [emoji]);

  return [
    <Form key="message-input">
      <CustomTextArea
        autoComplete="off"
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
        placeholder={`Message #${channelName}`}
        onKeyDown={(e) => {
          if (e.keyCode === enterKey && !isSubmitting) {
            handleSubmit(e);
          }
          if (e.keyCode === ARROW_UP_KEY) {
            startEditing();
            SetMessageWithEmoji('');
          }
        }}
      />
    </Form>,
    <ButtonsWrapper key="buttons-wrapper">
      <Button onClick={handleSubmit} type="submit" color="green" loading={isSubmitting}>
        Send
      </Button>
    </ButtonsWrapper>,
  ];
};

SendMessage.propTypes = {
  channelName: PropTypes.string.isRequired,
  values: PropTypes.shape({
    message: PropTypes.string.isRequired,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  enterKey: PropTypes.number.isRequired,
  startEditing: PropTypes.func.isRequired,
};

export default compose(
  graphql(createMessageMutation),
  withFormik({
    mapPropsToValues: ({ messageWithEmoji }) => ({ message: messageWithEmoji }),
    enableReinitialize: true,
    handleSubmit: async (
      { message },
      { props: { currentChannelId, mutate, SetMessageWithEmoji }, setSubmitting, setFieldValue }
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
      SetMessageWithEmoji('');
    },
  })
)(SendMessage);
