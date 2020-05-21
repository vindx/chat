import React, { useEffect } from 'react';
import Push from 'push.js';
import AppLayoutContainer from '../containers/AppLayoutContainer';

// eslint-disable-next-line react/jsx-props-no-spreading
export default (props) => {
  useEffect(() => {
    Push.create('Welcome to DICO chat!', {
      icon: '../logo.png',
      timeout: 4000,
      onClick() {
        window.focus();
        // eslint-disable-next-line react/no-this-in-sfc
        this.close();
      },
    });
  }, []);

  return <AppLayoutContainer {...props} />;
};
