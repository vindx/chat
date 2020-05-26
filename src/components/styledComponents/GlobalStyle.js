import {
  Input,
  TextArea,
  Modal,
  Segment,
  Header,
  Divider,
  Menu,
  Dropdown,
} from 'semantic-ui-react';
import styled, { createGlobalStyle } from 'styled-components';
import theme from 'styled-theming';

export const getBackground = theme('mode', {
  light: '#EEE',
  dark: '#111',
});

export const getDropDownBackground = theme('mode', {
  light: '#EEE',
  dark: '#3d3d3d',
});

export const getBorderColor = theme('mode', {
  light: 'lightGrey',
  dark: 'grey',
});

export const getTextColor = theme('mode', {
  light: '#111',
  dark: '#EEE',
});

export default createGlobalStyle`
  body{
    background-color: ${getBackground};
    color: ${getTextColor};
  }
`;

export const CustomInput = styled(Input)`
  > input {
    border-color: ${getBorderColor} !important;
    background: ${getBackground} !important;
    color: ${getTextColor} !important;
  }
  > i {
    color: ${getTextColor} !important;
  }
`;

export const CustomTextArea = styled(TextArea)`
  border-color: ${getBorderColor} !important;
  background: ${getBackground} !important;
  color: ${getTextColor} !important;
  max-height: 20vh;
  min-height: 35px;
  padding: 8px 13px !important;
  resize: none !important;
  @media screen and (min-width: 320px) and (max-width: 768px) {
    height: 28px;
    min-height: 25px;
    font-size: 12px !important;
  }
`;

export const CustomModal = styled(Modal)`
  background: ${getBackground} !important;
`;

export const CustomModalHeader = styled(Modal.Header)`
  background: ${getBackground} !important;
  color: ${getTextColor} !important;
`;

export const CustomModalContent = styled(Modal.Content)`
  background: ${getBackground} !important;
`;

export const CustomModalActions = styled(Modal.Actions)`
  background: ${getBackground} !important;
`;

export const CustomSegment = styled(Segment)`
  background: ${getBackground} !important;
`;

export const CustomHeader = styled(Header)`
  color: ${getTextColor} !important;
  text-align: ${({ textAlign }) => textAlign};
`;

export const CustomDivider = styled(Divider)`
  color: ${getTextColor} !important;
`;

export const CustomMenu = styled(Menu)`
  background: ${getBackground} !important;
  border-bottom: 1px solid ${getBorderColor} !important;
`;

export const CustomMenuItem = styled(Menu.Item)`
  color: ${getTextColor} !important;
  &:before,
  &:after {
    background: ${getBackground} !important;
  }
`;

export const CustomDropdownMenu = styled(Dropdown.Menu)`
  background: ${getDropDownBackground} !important;
  > div {
    color: ${getTextColor} !important;
  }
  &:after {
    background: ${getDropDownBackground} !important;
  }
`;
