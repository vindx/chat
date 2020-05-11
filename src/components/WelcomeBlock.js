import React from 'react';
import { Header as StyledHeader } from 'semantic-ui-react';

import Welcome from './styledComponents/Welcome';

const WelcomeBlock = () => (
  <Welcome>
    <StyledHeader as="h3">Welcome to</StyledHeader>
    <StyledHeader as="h1" color="orange">
      DICO
    </StyledHeader>
    <StyledHeader as="h3">chat</StyledHeader>
  </Welcome>
);

export default WelcomeBlock;
