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

export const ContactArea = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 100px;
  padding: 0 30px;

  p {
    font-size: 20px;
    color: #fefefe;
    margin: 15px 0 15px 0;
    max-width: 700px;
  }
`;
