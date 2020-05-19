import styled from 'styled-components';

export const SendMessageWrapper = styled.div`
  grid-column: 3;
  grid-row: 3;
  margin: 20px;
  display: grid;
  grid-template-columns: 3% 92% 5%;
  align-items: flex-end;
`;

export const ButtonsWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
`;

export const EmojiWrapper = styled.div`
  position: absolute;
  bottom: 60px;
  z-index: 2;
`;
