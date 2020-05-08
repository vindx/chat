import styled from 'styled-components';

export default styled.div`
  display: grid;
  height: 100vh;
  grid-template-columns: minmax(70px, 5vw) ${({ displaySideBar }) =>
    (displaySideBar
      ? 'minmax(100px, 15vw) minmax(150px, 80vw)'
      : '25px minmax(150px, calc(95% - 25px))')};
  grid-template-rows: auto 1fr auto;
`;
