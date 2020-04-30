import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

const createFileMessageMutation = gql`
  mutation($channelId: ID!, $file: File) {
    createMessage(channelId: $channelId, file: $file) {
      id
    }
  }
`;

const FileUpload = ({ children, channelId }) => {
  const [mutate] = useMutation(createFileMessageMutation);
  const onDrop = useCallback(
    async (acceptedFiles) => {
      const response = await mutate({
        variables: { channelId, file: acceptedFiles[0] },
      });
      console.log(response);
    },
    [channelId, mutate]
  );
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {children}
    </div>
  );
};

FileUpload.propTypes = {
  children: PropTypes.shape({}).isRequired,
  channelId: PropTypes.string.isRequired,
};

export default FileUpload;
