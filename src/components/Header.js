import React from 'react';
import { Header as SemanticHeader } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { HeaderWrapper } from './styledComponents/Header';

const Header = ({ channelName }) =>
  channelName && (
    <HeaderWrapper>
      <SemanticHeader textAlign="center">{`# ${channelName}`}</SemanticHeader>
    </HeaderWrapper>
  );

Header.propTypes = {
  channelName: PropTypes.string.isRequired,
};

export default Header;
