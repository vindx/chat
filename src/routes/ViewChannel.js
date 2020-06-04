import React, { useEffect } from 'react';
import { useDispatch, connect } from 'react-redux';
import { ThemeConsumer } from 'styled-components';
import PropTypes from 'prop-types';

import AppLayoutContainer from '../containers/AppLayoutContainer';
import { loadDarkThemeAction } from '../redux/actions';

const ViewChannel = ({ fetchedTheme, ...props }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadDarkThemeAction());
  }, []);

  return (
    <ThemeConsumer>
      {(theme) => {
        // eslint-disable-next-line no-unused-expressions
        fetchedTheme.mode !== theme.mode && theme.setTheme({ ...theme, ...fetchedTheme });

        return <AppLayoutContainer {...props} />;
      }}
    </ThemeConsumer>
  );
};

const mapStateToProps = (state) => ({
  fetchedTheme: { mode: `${state.theme.darkTheme ? 'dark' : 'light'}` },
});

ViewChannel.propTypes = {
  fetchedTheme: PropTypes.shape({
    mode: PropTypes.string,
  }).isRequired,
};

export default connect(mapStateToProps)(ViewChannel);
