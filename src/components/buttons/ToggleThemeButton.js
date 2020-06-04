import React from 'react';
import { Checkbox, Icon } from 'semantic-ui-react';
import styled, { ThemeConsumer } from 'styled-components';
import { useDispatch } from 'react-redux';
import { changeUserTheme } from '../../redux/actions';

const ThemeCheckBox = styled.div`
  width: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default () => {
  const dispatch = useDispatch();
  const handleChangeTheme = () => {
    dispatch(changeUserTheme());
    // theme.setTheme(
    //   theme.mode === 'dark' ? { ...theme, mode: 'light' } : { ...theme, mode: 'dark' }
    // );
  };
  return (
    <ThemeConsumer>
      {(theme) => (
        <ThemeCheckBox>
          <Icon name="sun" color="yellow" />
          <Checkbox slider checked={theme.mode === 'dark'} onClick={handleChangeTheme} />
          <Icon name="moon" color="blue" />
        </ThemeCheckBox>
      )}
    </ThemeConsumer>
  );
};
