import React, { Suspense } from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { routes } from './routes/routes';
import Loading from './components/common/Loading';

import theme from './config/theme';
import { AuthProvider } from './contexts/AuthContext';
import { JobHasApplyProvider } from './contexts/JobHasApply';

const Router = () => {
  const element = useRoutes(routes);
  return element;
};

const App: React.FC = () => {
  return (
    <ConfigProvider theme={theme}>
      <BrowserRouter>
        <Suspense fallback={<Loading.FullPage />}>
          <AuthProvider>
            <JobHasApplyProvider>
              <Router />
            </JobHasApplyProvider>
          </AuthProvider>
        </Suspense>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;