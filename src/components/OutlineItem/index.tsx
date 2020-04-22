import React from 'react';

import { Wrapper } from './styles';

interface OutlineItem {
  outlineColor: string;
  textColor: string;
}

const OutlineItem: React.FC<OutlineItem> = ({
  outlineColor,
  textColor,
  children,
}) => (
  <Wrapper textColor={textColor} outlineColor={outlineColor}>
    {children}
  </Wrapper>
);

export default OutlineItem;
