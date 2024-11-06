import React, { lazy } from 'react';
import { Outlet, RouteObject } from 'react-router-dom';
import EmployerRoute from './EmployerRoute';

// Lazy load các layouts với dynamic import
const MainLayout = lazy(() => import('../layouts/MainLayout').then(module => ({
  default: () => {
    const Layout = module.default;
    return (
      <Layout>
        <Outlet />
      </Layout>
    );
  }
})));

const CandidateLayout = lazy(() => import('../layouts/CandidateLayout').then(module => ({
  default: () => {
    const Layout = module.default;
    return (
      <Layout>
        <Outlet />
      </Layout>
    );
  }
})));

const EmployerLayout = lazy(() => import('../layouts/EmployerLayout').then(module => ({
  default: () => {
    const Layout = module.default;
    return (
      <Layout>
        <Outlet />
      </Layout>
    );
  }
})));

// Lazy load các pages
const HomePage = lazy(() => import('../pages/candidate/HomePage').then(module => ({
  default: module.default
})));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
    ]
  },
  {
    path: '/candidate',
    element: <CandidateLayout />,
    children: [
      // Thêm routes cho candidate sau
    ]
  },
  {
    path: '/employer',
    element: (
      <EmployerRoute>
        <EmployerLayout />
      </EmployerRoute>
    ),
    children: [
      // Thêm routes cho employer sau
    ]
  }
];