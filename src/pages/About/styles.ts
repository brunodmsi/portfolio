import styled, { keyframes } from 'styled-components';
import { darken } from 'polished';

const appearFromLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const Container = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  overflow-x: auto;

  animation: ${appearFromLeft} 1s;
`;

export const AboutArea = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 100px;
  padding: 0 30px;
  width: 50%;

  p {
    font-size: 20px;
    color: #fefefe;
    margin: 15px 0 15px 0;
    /* max-width: 700px; */
  }

  a {
    text-decoration: none;
    color: #c4c4c4;
  }

  img {
    width: 100px;
    align-self: center;
    border-radius: 50%;
    margin: 20px 0;
  }
`;

export const SkillsArea = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #fefefe;
  width: 50%;

  img {
    max-width: 100px;
    max-height: 100px;
    /* margin-right: 100px; */
  }

  section {
    display: grid;
    grid-template-columns: repeat(3, 1fr);

    div {
      max-width: 150px;
      display: flex;
      padding: 15px;
      flex-direction: column;
      background-color: #1e242c;
      justify-content: center;
      align-items: center;

      & {
        margin: 10px;
      }
    }
  }
`;
