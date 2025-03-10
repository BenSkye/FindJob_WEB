import React, { Suspense } from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { routes } from './routes/routes';
import Loading from './components/common/Loading';
import { GoogleOAuthProvider } from '@react-oauth/google';
import theme from './config/theme';
import { AuthProvider } from './contexts/AuthContext';
import { JobHasApplyProvider } from './contexts/JobHasApply';
import { SubcriptionProvider } from './contexts/Subscription';

const Router = () => {
  const element = useRoutes(routes);
  return element;
};

const App: React.FC = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ConfigProvider theme={theme}>
        <BrowserRouter>
          <Suspense fallback={<Loading.FullPage />}>
            <AuthProvider>
              <JobHasApplyProvider>
                <SubcriptionProvider>
                  <Router />
                </SubcriptionProvider>
              </JobHasApplyProvider>
            </AuthProvider>
          </Suspense>
        </BrowserRouter>
      </ConfigProvider>
    </GoogleOAuthProvider>
  );
};

export default App;