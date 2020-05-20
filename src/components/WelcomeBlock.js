import React from 'react';
import { Header as StyledHeader } from 'semantic-ui-react';

import Welcome from './styledComponents/Welcome';
import { CustomHeader } from './styledComponents/GlobalStyle';

const WelcomeBlock = () => (
  <Welcome>
    <CustomHeader as="h3">Welcome to</CustomHeader>
    <StyledHeader as="h1" color="orange">
      DICO
    </StyledHeader>
    <CustomHeader as="h3">chat</CustomHeader>
  </Welcome>
);

export default WelcomeBlock;
