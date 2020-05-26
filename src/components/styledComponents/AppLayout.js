import styled from 'styled-components';

export default styled.div`
  min-width: 320px;
  display: grid;
  height: 100vh;
  grid-template-columns: minmax(40px, 5vw) ${({ displaySideBar }) =>
    (displaySideBar
      ? 'minmax(120px, 15vw) minmax(160px, 80vw)'
      : '25px minmax(255px, calc(95% - 25px))')};
  grid-template-rows: auto 1fr auto;
`;
