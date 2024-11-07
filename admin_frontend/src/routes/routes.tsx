import { lazy } from 'react';
import { Outlet, RouteObject } from 'react-router-dom';
import Dashboard from '../pages/Admin/Dashboard';
import PostJob from '../pages/Admin/PostJob';
import User from '../pages/Admin/User';
import Level from '../pages/Admin/Level';
import Category from '../pages/Admin/Category';
import Setting from '../pages/Admin/Setting';
import Login from '../pages/Admin/login/Login';
import NotFound from '../components/common/404';
import Forbidden from '../components/common/403';
import ProtectedRoute from '../components/ProtectedRoute';

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
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
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
    element: <Login />,
  },
  {
    path: '*',
    element: <NotFound />,
  }
];