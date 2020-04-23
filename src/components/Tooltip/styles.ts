import styled from 'styled-components';
import { SizeObject } from './index';

interface WrapperProps {
  size: SizeObject;
  colors?: {
    font: string;
    background: string;
  };
}

export const Wrapper = styled.div<WrapperProps>`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  span {
    position: absolute;
    left: 80%;
    font-size: ${({ size }) => size.font};
    padding: ${({ size }) => size.box};
    font-weight: 500;
    white-space: nowrap;
    color: ${({ colors }) => (colors && colors.font ? colors.font : '#000')};
    border-radius: 50px;
    background-color: ${({ colors }) =>
      colors && colors.background ? colors.background : '#fff'};
    box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1),
      0 5px 15px rgba(0, 0, 0, 0.07);

    pointer-events: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    opacity: 0;
    transition: all 0.2s ease-in-out;
  }

  &:hover {
    span {
      left: 120%;
      opacity: 0.9;
    }
  }
`;
