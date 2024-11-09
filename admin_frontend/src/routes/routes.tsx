import { lazy } from 'react';
import { Outlet, RouteObject, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Admin/Dashboard';
import PostJob from '../pages/Admin/PostJob';
import User from '../pages/Admin/User';
import Level from '../pages/Admin/Level';
import Category from '../pages/Admin/Category';
import Login from '../pages/Admin/login/Login';
import NotFound from '../components/common/404';
import ProtectedRoute from './ProtectedRoute';
import ProfilePage from '../pages/Admin/profile/ProfilePage';
import CompaniesPage from '../pages/Admin/Companies';
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
    path: '/', // Root path
    element: <Navigate to="/admin/login" replace />,
  },
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
        path: '/admin/companies',
        element: <CompaniesPage />,
      },
      {
        path: '/admin/profile',
        element: <ProfilePage />,
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