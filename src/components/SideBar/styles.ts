import styled from 'styled-components';
import { shade } from 'polished';

export const Wrapper = styled.aside`
  display: flex;
  width: 100px;
  background-color: #181818;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;
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

    svg + svg {
      margin-top: 30px;
    }
  }

  footer {
    display: flex;
    flex-direction: column;
    padding-bottom: 20px;

    align-items: center;

    a + a {
      margin-top: 20px;
    }
  }
`;
