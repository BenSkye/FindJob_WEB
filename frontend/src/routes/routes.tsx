import React, { lazy } from 'react';
import { Outlet, RouteObject } from 'react-router-dom';
import EmployerRoute from './EmployerRoute';
import Login from '../pages/login/Login';
import Register from '../pages/login/Register';
import JobSearch from '../pages/candidate/JobSearch';

import Dashboard from '../pages/employer/Dashboard';
import PostJob from '../pages/employer/PostJob';

import ManageJobs from '../pages/employer/ManageJobs';
import Template from '../pages/candidate/teamplate';
import CVBuilder from '../pages/candidate/CVBuilder';
import PersonalApplication from '../pages/candidate/PersonalApplication';
import EditProfile from '../pages/employer/EditProfile';
import EmployerProfile from '../pages/employer/EmployerProfile';
import PersonalJob from '../pages/employer/PersonalJob';
import EditJob from '../pages/employer/EditJob';
import JobApplications from '../pages/employer/JobApplications';
import Payment from '../pages/employer/Payment';
import CvProfile from '../pages/candidate/CvProfile';
// import CreateTemplate from '../pages/candidate/CreateTemplate';
import ForgotPassword from '../pages/login/ForgotPassword';
import ResetPassword from '../pages/login/ResetPassword';

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

const ProfilePage = lazy(() => import('../pages/profile/ProfilePage').then(module => ({
  default: module.default
})));

const AboutPage = lazy(() => import('../pages/about/AboutPage').then(module => ({
  default: module.default
})));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: '/jobsdetail/:id', element: <JobsDetail /> },
      { path: '/jobslist', element: <JobsList /> },
      { path: '/job-search', element: <JobSearch /> },
      { path: '/template', element: <Template /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '/create-template/:templateId', element: <CVBuilder /> },
      { path: '/personal-applications', element: <PersonalApplication /> },
      { path: '/cv-profile', element: <CvProfile /> },
      { path: '/about', element: <AboutPage /> },
    ]
  },
  {
    path: '/candidate',
    element: <CandidateLayout />,
    children: [


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
      {
        path: '/employer/dashboard',
        element: <Dashboard />
      },
      {
        path: '/employer/post-job',
        element: <PostJob />
      },


      {
        path: '/employer/editprofile',
        element: <EditProfile />
      },
      {
        path: '/employer/employerprofile',
        element: <EmployerProfile />
      },
      {
        path: '/employer/managejobs',
        element: <ManageJobs />
      },
      {
        path: '/employer/personal-job',
        element: <PersonalJob />
      },
      {
        path: '/employer/edit-job/:id',
        element: <EditJob />
      },
      {
        path: '/employer/job-applications/:jobId',
        element: <JobApplications />
      },
      {
        path: '/employer/payment',
        element: <Payment />
      }
    ]
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
  }
];