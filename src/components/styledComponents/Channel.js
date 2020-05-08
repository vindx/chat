import styled, { css } from 'styled-components';

export const ChannelWrapper = styled.div`
  grid-column: 1;
  grid-row: 1/4;
  background-color: #ff7f50;
  display: flex;
  flex-direction: column;
  z-index: 2;
`;

export const ChannelList = styled.ul`
  width: 100%;
  padding-left: 0px;
  list-style: none;
  overflow-y: auto;
  ::-webkit-scrollbar {
    display: none;
  }
`;

export const ChannelListItem = styled.li`
  height: 50px;
  width: 50px;
  background-color: #679ed2;
  border-color: #408ad2;
  color: #fffafa;
  margin: auto;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  border-radius: 10px;
  cursor: pointer;
  &:hover {
    border-style: solid;
    border-width: thick;
  }
  ${({ active }) =>
    active && css`
      border-style: solid;
      border-width: thick;
      border-color: #408ad2;
    `}
  ${({ bgColor }) =>
    bgColor && css`
      background-color: ${bgColor};
    `}
  ${({ borderColor }) =>
    borderColor && css`
      border-color: ${borderColor};
    `}
`;
