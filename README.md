# Internal Document Management System (CMS)

A professional frontend boilerplate for building internal document management and company information systems.

## Tech Stack
- **ReactJS** (Vite)
- **State Management**: Redux Toolkit & React-Redux
- **UI Framework**: Ant Design (antd)
- **API Styling**: Axios for API calls with interceptors
- **Styling**: SCSS (Vanilla CSS principles)
- **Routing**: React Router DOM (v6+)

## Project Structure
```text
src/
├── api/            # Axios setup and endpoint definitions
├── assets/         # Images, fonts, static assets
├── components/     # Reusable UI components
├── constants/      # App constants, config, enums
├── features/       # Redux slices and store
├── hooks/          # Custom react hooks
├── layouts/        # Page layouts (MainLayout)
├── pages/          # Page components (Login, Dashboard, etc.)
├── routes/         # Routing configuration with Protected Routes
├── styles/         # SCSS variables and global styles
└── utils/          # Helper functions
```

## Features Implemented
- **Vite Setup**: Fast development and building.
- **Redux Integration**: Centralized auth state.
- **Ant Design**: Professional UI components with custom theme.
- **Axios Interceptors**: Token management and error handling ready.
- **Protected Routing**: Login-protected areas.
- **Responsive Layout**: Sidebar-based CMS layout.

## How to Run
1. `npm install`
2. `npm run dev`
