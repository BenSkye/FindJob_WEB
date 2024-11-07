import React, { lazy } from 'react';
import { Outlet, RouteObject } from 'react-router-dom';



const AdminLayout = lazy(() => import('../layouts/AdminLayout').then(module => ({
  default: () => {
    const Layout = module.default;
    return (
      <Layout>
        <Outlet />
      </Layout>
    );
  }
})));


export const routes: RouteObject[] = [
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      // Thêm routes cho admin sau
    ]
  }
];