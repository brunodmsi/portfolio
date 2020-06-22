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

export const Github = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 100px;
  padding: 0 30px;
`;
