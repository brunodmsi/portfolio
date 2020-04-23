import styled, { keyframes } from 'styled-components';

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

export const Introduction = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 100px;
  padding: 0 30px;

  code {
    margin: 20px 0 15px;
    font-size: 20px;
    color: #a8a8b3;
  }

  h1 {
    font-size: 60px;
    color: #fefefe;
    margin-bottom: 15px;
  }

  h3 {
    margin-top: 20px;
    font-size: 30px;
    font-weight: lighter;
    color: #fefefe;
  }

  span {
    font-size: 16px;
    font-weight: lighter;
    color: #5a5a5a;
  }

  > a {
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    margin-top: 60px;
    border: 3px solid #1d4a57;
    height: 50px;
    background: transparent;
    color: #fefefe;
    font-weight: bold;
    padding: 0 30px;
    transition: background 0.2s;

    &:hover {
      background-color: #1d4a57;
    }
  }
`;
