import styled from 'styled-components';

export const SendMessageWrapper = styled.div`
  grid-column: 3;
  grid-row: 3;
  margin: 20px;
  display: grid;
  grid-template-columns: minmax(25px, 3%) minmax(50px, 92%) minmax(35px, 5%);
  align-items: flex-end;
`;

export const ButtonsWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  @media screen and (min-width: 320px) and (max-width: 768px) {
    > button {
      padding: 8px !important;
      width: 40px;
      font-size: 12px !important;
    }
  }
  @media screen and (min-width: 769px) and (max-width: 1025px) {
    > button {
      padding: 11px 5px !important;
    }
  }
`;

export const EmojiWrapper = styled.div`
  position: absolute;
  bottom: 60px;
  z-index: 2;
`;
