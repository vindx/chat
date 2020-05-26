import styled, { css } from 'styled-components';

export const ChannelWrapper = styled.div`
  grid-column: 1;
  grid-row: 1/4;
  background-color: #ff7f50;
  display: flex;
  flex-direction: column;
  z-index: 2;
  @media screen and (min-width: 320px) and (max-width: 768px) {
    > div {
      > button {
        padding: 3px !important;
        width: 40px;
        font-size: 12px !important;
      }
    }
  }
  @media screen and (min-width: 769px) and (max-width: 1025px) {
    > div {
      > button {
        padding: 5px !important;
        width: 50px;
      }
    }
  }
  @media screen and (min-width: 1025px) and (max-width: 1281px) {
    > div {
      > button {
        padding: 8px !important;
        width: 60px;
      }
    }
  }
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
    active
    && css`
      border-style: solid;
      border-width: thick;
      border-color: #408ad2;
    `}
  ${({ bgColor }) =>
    bgColor
    && css`
      background-color: ${bgColor};
    `}
  ${({ borderColor }) =>
    borderColor
    && css`
      border-color: ${borderColor};
    `}
    
  @media screen and (min-width: 320px) and (max-width: 768px) {
    height: 30px;
    width: 30px;
    font-size: 18px;
    border-radius: 8px;
    margin-bottom: 8px;
  }
  @media screen and (min-width: 769px) and (max-width: 1025px) {
    height: 35px;
    width: 35px;
    font-size: 20px;
  }
  @media screen and (min-width: 1025px) and (max-width: 1281px) {
    height: 45px;
    width: 45px;
    font-size: 22px;
  }
`;
