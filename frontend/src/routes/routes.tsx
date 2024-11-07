import React, { lazy } from 'react';
import { Outlet, RouteObject } from 'react-router-dom';
import EmployerRoute from './EmployerRoute';
import Login from '../pages/login/Login';
import Register from '../pages/login/Register';
import JobSearch from '../pages/candidate/JobSearch';
import Template from '../pages/candidate/Teamplate';
import CVBuilder from '../pages/candidate/CVBuilder';
// import CreateTemplate from '../pages/candidate/CreateTemplate';

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

const JobsDetail = lazy(() => import('../pages/jobs/JobsDetail').then(module => ({
  default: module.default
})));

const JobsList = lazy(() => import('../pages/jobs/JobsList').then(module => ({
  default: module.default
})));


export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: '/jobsdetail', element: <JobsDetail /> },
      { path: '/jobslist', element: <JobsList /> },
      { path: '/job-search', element: <JobSearch /> },
      { path: '/template', element: <Template /> },
      { path: '/create-template/:templateId', element: <CVBuilder /> },
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
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  }
];