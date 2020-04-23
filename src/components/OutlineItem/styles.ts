import styled from 'styled-components';

interface WrapperProps {
  outline: {
    color: string;
    size?: number;
    thickness?: number;
  };
  textColor: string;
  activateCursor?: boolean;
  size?: number;
  rotation?: number;
}

export const Wrapper = styled.div<WrapperProps>`
  font-size: ${props => (props.size ? `${props.size}px` : '48px')};
  font-family: 'Rubik', sans-serif;
  font-weight: 700;
  display: inline-block;
  text-decoration: none;
  position: relative;
  cursor: ${props => (props.activateCursor ? 'pointer' : 'default')};
  padding: 0 10px;

  rotate: ${props => (props.rotation ? `${props.rotation}deg` : '0deg')};

  a {
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    color: ${props => props.textColor};

    ::before {
      content: '';
      height: ${({ outline }) => (outline.size ? `${outline.size}px` : '20px')};
      width: ${({ outline }) => (outline.size ? `${outline.size}px` : '20px')};
      position: absolute;
      top: 0;
      left: 0;
      border-top: ${({ outline }) =>
          outline.thickness ? `${outline.thickness}px` : '4px'}
        solid ${({ outline }) => outline.color};
      border-left: ${({ outline }) =>
          outline.thickness ? `${outline.thickness}px` : '4px'}
        solid ${({ outline }) => outline.color};
    }

    ::after {
      content: '';
      height: ${({ outline }) => (outline.size ? `${outline.size}px` : '20px')};
      width: ${({ outline }) => (outline.size ? `${outline.size}px` : '20px')};
      position: absolute;
      right: 0;
      bottom: 0;
      border-right: ${({ outline }) =>
          outline.thickness ? `${outline.thickness}px` : '4px'}
        solid ${({ outline }) => outline.color};
      border-bottom: ${({ outline }) =>
          outline.thickness ? `${outline.thickness}px` : '4px'}
        solid ${({ outline }) => outline.color};
    }
  }
`;
