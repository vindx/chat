import React from 'react';
import { Checkbox, Icon } from 'semantic-ui-react';
import styled, { ThemeConsumer } from 'styled-components';

const ThemeCheckBox = styled.div`
  width: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default () => (
  <ThemeConsumer>
    {(theme) => {
      const handleChangeTheme = () => {
        theme.setTheme(
          theme.mode === 'dark' ? { ...theme, mode: 'light' } : { ...theme, mode: 'dark' }
        );
      };
      return (
        <ThemeCheckBox>
          <Icon name="sun" color="yellow" />
          <Checkbox slider checked={theme.mode === 'dark'} onClick={handleChangeTheme} />
          <Icon name="moon" color="blue" />
        </ThemeCheckBox>
      );
    }}
  </ThemeConsumer>
);
