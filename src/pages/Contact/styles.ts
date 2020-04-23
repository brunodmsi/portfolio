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

  form {
    display: flex;
    width: 100%;
    max-width: 700px;
    flex-direction: column;

    input,
    textarea {
      height: 44px;
      padding: 15px 20px;
      font-family: 'Montserrat', sans-serif;
      border: 0;
      border-radius: 4px;
      color: #f9f9f9;
      box-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.1);
      background-color: #1e242c;

      ::placeholder {
        color: #f0f0f0;
      }

      & + input {
        margin-top: 5px;
      }
    }

    span {
      font-size: 15px;
      color: #f64c75;
      padding: 5px 10px;
    }

    textarea {
      min-height: 150px;
      max-height: 300px;
      margin-top: 5px;
      font-family: 'Montserrat', sans-serif;
      resize: vertical;
    }

    button {
      display: flex;
      justify-content: center;
      align-items: center;
      text-decoration: none;
      margin-top: 5px;
      height: 50px;
      border: 0;
      background: #1d4a57;
      color: #fefefe;
      font-weight: bold;
      padding: 0 30px;
      transition: background 0.2s;

      &:hover {
        background-color: ${darken(0.03, '#1d4a57')};
      }
    }
  }
`;
