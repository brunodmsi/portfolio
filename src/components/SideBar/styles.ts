import styled from 'styled-components';
import { shade } from 'polished';

export const Wrapper = styled.nav`
  display: flex;
  width: 100px;
  background-color: #181818;
  min-height: 100vh;
  border-right: 1px solid ${shade(0.1, '#181818')};

  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  padding-top: 20px;

  section {
    display: flex;
    flex-direction: column;

    align-items: center;
    justify-content: center;

    div {
      padding: 20px;
      transition: color 0.2s;
      transition: transform 0.2s;

      &:hover {
        transform: translateX(5px);

        svg {
          color: #49caeb;
        }
      }

      svg {
        color: #4f4f4f;
      }
    }
  }

  footer {
    display: flex;
    flex-direction: column;
    padding-bottom: 20px;

    align-items: center;

    div {
      padding: 10px;
      transition: color 0.2s;
      transition: transform 0.2s;

      &:hover {
        transform: translateX(5px);

        svg {
          color: #49caeb;
        }
      }

      & + div {
        margin-top: 10px;
      }
      svg {
        color: #4f4f4f;
      }
    }
  }
`;
