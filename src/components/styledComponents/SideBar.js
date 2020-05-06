import styled from 'styled-components';

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
  flex-direction: column;
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
