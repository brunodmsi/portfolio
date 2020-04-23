import React, { createRef } from 'react';
import { Link } from 'react-router-dom';

import { Wrapper } from './styles';

interface OutlineItem {
  outline: {
    color: string;
    size?: number;
    thickness?: number;
  };
  textColor: string;
  size?: number;
  onClick?: VoidFunction;
  rotate?: number;
  clickable?: {
    cursor?: boolean;
    goTo?: string;
    navigate?: string;
  };
}

const OutlineItem: React.FC<OutlineItem> = ({
  outline,
  textColor,
  onClick,
  clickable,
  size,
  rotate,
  children,
}) => {
  function render(): JSX.Element {
    if (clickable?.navigate) {
      return <Link to={clickable?.navigate}>{children}</Link>;
    }

    return <a href={clickable?.goTo}>{children}</a>;
  }

  return (
    <Wrapper
      textColor={textColor}
      outline={outline}
      activateCursor={clickable?.cursor}
      size={size}
      onClick={onClick}
      rotation={rotate}
    >
      {render()}
    </Wrapper>
  );
};

export default OutlineItem;
