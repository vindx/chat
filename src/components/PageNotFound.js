import React from 'react';
import { Link } from 'react-router-dom';

import WelcomeBlock from './WelcomeBlock';
import PageNotFoundStyled from './styledComponents/PageNotFound';

const PageNotFound = () => (
  <>
    <WelcomeBlock />
    <PageNotFoundStyled>
      <h2>Sorry, this page isn&#39;t available.</h2>
      <p>
        The link you followed may be broken, or the page may have been removed.
        <Link to="/"> Go back to DICO</Link>
      </p>
    </PageNotFoundStyled>
  </>
);

export default PageNotFound;
