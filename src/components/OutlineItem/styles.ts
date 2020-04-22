import styled, { css } from 'styled-components';

interface WrapperProps {
  outlineColor: string;
  textColor: string;
}

export const Wrapper = styled.a<WrapperProps>`
  font-size: 48px;
  font-family: 'Rubik', sans-serif;
  font-weight: 700;
  color: ${props => props.textColor};
  display: inline-block;
  text-decoration: none;
  position: relative;
  padding: 0 10px;

  ::before {
    content: '';
    height: 20px;
    width: 20px;
    position: absolute;
    top: 0;
    left: 0;
    border-top: 4px solid ${props => props.outlineColor};
    border-left: 4px solid ${props => props.outlineColor};
  }

  ::after {
    content: '';
    height: 20px;
    width: 20px;
    position: absolute;
    right: 0;
    bottom: 0;
    border-right: 4px solid ${props => props.outlineColor};
    border-bottom: 4px solid ${props => props.outlineColor};
  }
`;
