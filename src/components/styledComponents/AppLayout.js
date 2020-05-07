import styled from 'styled-components';

export default styled.div`
  display: grid;
  height: 100vh;
  grid-template-columns: minmax(70px, 5vw) minmax(100px, 15vw) minmax(150px, 80vw);
  grid-template-rows: auto 1fr auto;
`;
