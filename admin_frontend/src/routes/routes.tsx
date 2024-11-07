import React, { lazy } from 'react';
import { Outlet, RouteObject } from 'react-router-dom';
import AdminLogin from '../pages/Admin/AdminLogin';
import Dashboard from '../pages/Admin/Dashboard';
import PostJob from '../pages/Admin/PostJob';
import User from '../pages/Admin/User';
import Level from '../pages/Admin/Level';
import Category from '../pages/Admin/Category';
import Setting from '../pages/Admin/Setting';
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
      {
        path: '/admin/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/admin/post-job',
        element: <PostJob />,
      },
      {
        path: '/admin/users',
        element: <User />,
      },
      {
        path: '/admin/levels',
        element: <Level />,
      },
      {
        path: '/admin/job-category',
        element: <Category />,
      },
      {
        path: '/admin/settings',
        element: <Setting />,
      },
    ]
  },
  {
    path: '/admin/login',
    element: <AdminLogin />,
  }
];