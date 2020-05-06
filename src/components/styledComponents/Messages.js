import styled, { css } from 'styled-components';

export const MessagesWrapper = styled.div`
  grid-column: 3;
  grid-row: 2;
  padding-left: 20px;
  padding-right: 20px;
  display: flex;
  flex-direction: column-reverse;
  overflow-y: auto;
  ${({ center }) =>
    center && css`
      align-items: center;
      justify-content: center;
    `}
`;

export const MessageWrapper = styled.div`
  display: flex;
  ${({ myMessage }) =>
    myMessage && css`
      justify-content: flex-end;
    `}
`;

export const Message = styled.div`
  width: 100%;
  margin: 5px;
  display: flex;
  flex-direction: column;
  ${({ myMessage }) =>
    myMessage && css`
      align-items: flex-end;
    `}
`;

export const MessageHeader = styled.div`
  display: flex;
  flex-direction: row;
  ${({ myMessage }) =>
    myMessage && css`
      flex-direction: row-reverse;
    `}
`;

export const UserName = styled.span`
  width: fit-content;
  font-size: 18px;
  color: blue;
  cursor: pointer;
`;
export const MessageText = styled.div`
  max-width: 80%;
  word-wrap: break-word;
`;

export const CreatedAt = styled.span`
  width: fit-content;
  font-size: 12px;
  opacity: 0.6;
`;
