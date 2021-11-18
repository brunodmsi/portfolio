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
  align-items: center;
  overflow-x: auto;

  animation: ${appearFromLeft} 1s;
`;

export const ProjectArea = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: left;
  align-items: flex-start;
  margin: 0 100px;
  padding: 0 30px;

  section {
    display: grid;
    width: 100%;
    height: 100%;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-top: 2rem;

    > .project {
      display: flex;
      color: white;
      flex-direction: column;
      width: 100%;
      border-radius: 15px;
      background-color: ${darken(0.03, '#171f34')};
      padding: 35px;

      div.project-header {
        display: flex;
        align-items: center;
        margin-bottom: 15px;

        img {
          max-width: 80px;
          max-height: 80px;
          align-self: center;
          margin-right: 20px;
        }
      }

      a {
        margin-top: 15px;
        font-weight: lighter;
        color: #5a5a5a;
      }
    }
  }
`;
