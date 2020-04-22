import React from 'react';
import {
  Route as ReactDOMRoute,
  RouteProps as ReactDOMRouteProps,
} from 'react-router-dom';

import SideBar from '../components/SideBar';

interface RouteProps extends ReactDOMRouteProps {
  component: React.ComponentType;
}

const Route: React.FC<RouteProps> = ({ component: Component, ...rest }) => {
  const DefaultLayout: React.FC = ({ children }) => (
    <>
      <SideBar />

      {children}
    </>
  );

  return (
    <ReactDOMRoute
      {...rest}
      render={() => (
        <DefaultLayout>
          <Component />
        </DefaultLayout>
      )}
    />
  );
};

export default Route;
