import React, { useEffect } from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';

import SideBar from '../components/SideBar';

const getChannelQuery = gql`
  query($id: ID!) {
    getChannel(id: $id) {
      id
      name
      owner {
        id
        userName
      }
      members {
        id
        userName
      }
    }
  }
`;

const SideBarContainer = ({ setChannelName }) => {
  const {
    loading,
    error,
    data: { getChannel: { name, owner: { userName: ownerUserName } = {}, members } = {} } = {},
  } = useQuery(getChannelQuery, {
    variables: { id: '5e9d93183615d8062c2c8ede' },
  });
  useEffect(() => {
    if (name) {
      setChannelName(name);
    }
  }, [name, setChannelName]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return <SideBar channelName={name} ownerUserName={ownerUserName} members={members} />;
};

SideBarContainer.propTypes = {
  setChannelName: PropTypes.func.isRequired,
};

export default SideBarContainer;
