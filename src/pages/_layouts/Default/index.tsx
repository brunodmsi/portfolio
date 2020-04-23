import React from 'react';

import { Wrapper } from './styles';
import SideBar from '../../../components/SideBar';

const DefaultLayout: React.FC = ({ children }) => (
  <>
    <Wrapper>
      <SideBar />

      {children}
    </Wrapper>
  </>
);

export default DefaultLayout;
