import React from 'react';
import PropTypes from 'prop-types';

import { HeaderWrapper } from './styledComponents/Header';
import { CustomHeader } from './styledComponents/GlobalStyle';

const Header = ({ channelName }) =>
  channelName && (
    <HeaderWrapper>
      <CustomHeader textAlign="center">{`# ${channelName}`}</CustomHeader>
    </HeaderWrapper>
  );

Header.propTypes = {
  channelName: PropTypes.string.isRequired,
};

export default Header;
