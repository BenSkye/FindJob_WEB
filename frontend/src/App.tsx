import React, { Suspense } from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { routes } from './routes/routes';
import Loading from './components/common/Loading';

// Theme config
import theme from './config/theme';

const Router = () => {
  const element = useRoutes(routes);
  return element;
};

const App: React.FC = () => {
  return (
    <ConfigProvider theme={theme}>
      <BrowserRouter>
        <Suspense fallback={<Loading.FullPage />}>
          <Router />
        </Suspense>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;