import styled from 'styled-components';

export const EditMessageContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const EditMessageWrapper = styled.div`
  width: 90%;
  margin: 0 auto;
  padding: 0 0 0 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-top: 1px solid orange;
`;

export const EditMessageBody = styled.div`
  width: 90%;
  display: flex;
  flex-direction: column;
`;

export const EditMessageButton = styled.div`
  width: 10%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const EditMessageHeader = styled.span`
  color: blue;
  font-size: 16px;
  font-style: italic;
`;

export const EditMessageText = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
