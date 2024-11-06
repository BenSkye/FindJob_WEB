# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})



job-search-portal/
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── styles/
│   │       ├── global.css
│   │       └── variables.css
│   ├── layouts/
│   │   ├── MainLayout.tsx        
│   │   ├── CandidateLayout.tsx   
│   │   └── EmployerLayout.tsx    
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Loading.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Notification.tsx
│   │   ├── candidate/
│   │   │   ├── JobCard.tsx
│   │   │   ├── JobList.tsx
│   │   │   ├── CVTemplate.tsx
│   │   │   └── ApplyForm.tsx
│   │   └── employer/
│   │       ├── JobPostForm.tsx
│   │       ├── Dashboard/
│   │       │   ├── Statistics.tsx
│   │       │   ├── ApplicationList.tsx
│   │       │   └── Chart.tsx
│   │       └── PaymentForm.tsx
│   ├── pages/
│   │   ├── candidate/
│   │   │   ├── HomePage.tsx
│   │   │   ├── JobSearch.tsx
│   │   │   ├── CVBuilder.tsx
│   │   │   └── Profile.tsx
│   │   └── employer/
│   │       ├── Dashboard.tsx
│   │       ├── PostJob.tsx
│   │       ├── ManageJobs.tsx
│   │       └── Applications.tsx
│   ├── services/
│   │   ├── api/
│   │   │   ├── jobApi.ts
│   │   │   ├── userApi.ts
│   │   │   ├── paymentApi.ts
│   │   │   └── cvApi.ts
│   │   └── types/
│   │       ├── job.types.ts
│   │       ├── user.types.ts
│   │       ├── payment.types.ts
│   │       └── cv.types.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useJobs.ts
│   │   ├── usePayment.ts
│   │   └── useNotification.ts
│   ├── utils/
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   ├── validation.ts
│   │   └── formatters.ts
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── routes/
│   │   ├── PrivateRoute.tsx
│   │   ├── EmployerRoute.tsx
│   │   └── routes.ts
│   ├── config/
│   │   ├── axios.ts
│   │   └── theme.ts
│   ├── App.tsx
│   └── main.tsx
├── public/
│   ├── favicon.ico
│   └── images/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .gitignore
├── .env
├── .env.example
└── README.md
```
