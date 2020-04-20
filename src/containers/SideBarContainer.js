import React, { useEffect } from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';

import SideBar, { SideBarWrapper } from '../components/SideBar';

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

const SideBarContainer = ({ setChannelName, currentChannelId }) => {
  const {
    loading,
    error,
    data: { getChannel: { name, owner: { userName: ownerUserName } = {}, members } = {} } = {},
  } = useQuery(getChannelQuery, {
    variables: { id: currentChannelId },
  });
  useEffect(() => {
    if (name) {
      setChannelName(name);
    }
  }, [name, setChannelName]);

  if (loading) return <p>Loading...</p>;
  if (!name) {
    return (
      <SideBarWrapper style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Please choose channel
      </SideBarWrapper>
    );
  }
  if (error) return <p>Error :(</p>;

  return <SideBar channelName={name} ownerUserName={ownerUserName} members={members} />;
};

SideBarContainer.propTypes = {
  setChannelName: PropTypes.func.isRequired,
  currentChannelId: PropTypes.string,
};
SideBarContainer.defaultProps = {
  currentChannelId: undefined,
};

export default SideBarContainer;
