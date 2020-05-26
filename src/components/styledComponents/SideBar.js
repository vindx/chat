import styled, { css } from 'styled-components';

const paddingLeft = 'padding-left: 10px';
export const PushLeft = styled.div`
  ${paddingLeft}
`;

export const SideBarWrapper = styled.div`
  grid-column: 2;
  grid-row: 1/4;
  background-color: #ffa07a;
  color: #fffafa;
  display: flex;
  flex-direction: row;
  ${({ center }) =>
    center
    && css`
      align-items: center;
      justify-content: center;
    `};
`;

export const SideBarContent = styled.div`
  width: calc(100% - 25px);
  padding: 0 10px;
  flex-direction: column;
  display: ${({ display }) => (display === 'true' ? 'flex' : 'none')};
  @media screen and (min-width: 320px) and (max-width: 1025px) {
    > div {
      > button {
        padding: 3px !important;
        width: 80px;
        font-size: 12px !important;
      }
    }
  }
  @media screen and (min-width: 1025px) and (max-width: 1281px) {
    > div {
      > button {
        padding: 8px !important;
        width: 110px;
      }
    }
  }
`;

export const SideBarDisplayTrigger = styled.div`
  width: 25px;
  height: 100vh;
  background: linear-gradient(90deg, #ffa07a, #ff7f50);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  cursor: pointer;
`;

export const DisplayTriggerIcon = styled.div`
  transition: transform 0.4s linear;
  transform: rotate(${({ display }) => (display === 'true' ? '60' : '0')}deg);
`;

export const BottomSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 1em;
  :last-of-type {
    margin-top: auto;
  }
`;

export const ChannelNameHeader = styled.h1`
  font-size: 30px;
  margin: 0;
  word-wrap: break-word;
`;

export const SideBarListWrapper = styled.div`
  width: 100%;
  margin: 1em 0;
  list-style: none;
  display: flex;
  flex-direction: column;
`;

export const SideBarList = styled.ul`
  margin: 0 0 10px 0;
  padding-left: 0;
  list-style: none;
  max-height: 30vh;
  overflow-y: auto;
`;

export const SideBarListItem = styled.li`
  cursor: pointer;
  ${paddingLeft};
  &:hover {
    background: #6ab0c1;
  }
`;

export const SideBarListHeader = styled.li`
  font-size: 14px;
  ${paddingLeft};
`;

export const Green = styled.span`
  color: #6dca98;
`;
