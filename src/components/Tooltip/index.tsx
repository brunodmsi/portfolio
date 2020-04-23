import React, { useState } from 'react';

import { Wrapper } from './styles';

interface TooltipProps {
  tooltipText: string;
  size?: string;
  colors?: {
    font: string;
    background: string;
  };
  children: React.ReactElement | HTMLElement;
}

export interface SizeObject {
  box: string;
  font: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  size = 'medium',
  colors,
  children,
  tooltipText,
}) => {
  const tooltipSize = (): SizeObject => {
    const defaultSize = {
      vertical: 10,
      horizontal: 20,
      font: 16,
    };

    const sizes = {
      small: {
        box: `${defaultSize.vertical / 2}px ${defaultSize.horizontal / 2}px`,
        font: `${defaultSize.font / 1.25}px`,
      },
      medium: {
        box: `${defaultSize.vertical}px ${defaultSize.horizontal}px`,
        font: `${defaultSize.font}px`,
      },
      big: {
        box: `${defaultSize.vertical * 2}px ${defaultSize.horizontal * 2}px`,
        font: `${defaultSize.font * 1.25}px`,
      },
    };

    const pickOrFail = Object.entries(sizes).find(value => value[0] === size);
    const sizePicked = pickOrFail
      ? { box: pickOrFail[1].box, font: pickOrFail[1].font }
      : { box: sizes.medium.box, font: sizes.medium.font };

    return sizePicked;
  };

  return (
    <Wrapper size={tooltipSize()} colors={colors}>
      {children}
      <span>{tooltipText}</span>
    </Wrapper>
  );
};

export default Tooltip;
