import React from 'react';
import styled from 'styled-components';
import { Header as SemanticHeader } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const HeaderWrapper = styled.div`
  grid-column: 3;
  grid-row: 1;
`;

const Header = ({ channelName }) => (
  <HeaderWrapper>
    <SemanticHeader textAlign="center">{`# ${channelName}`}</SemanticHeader>
  </HeaderWrapper>
);

Header.propTypes = {
  channelName: PropTypes.string.isRequired,
};

export default Header;
