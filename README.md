# Certificate of Analysis (CoA) Dashboard

A modern web application for managing and viewing Certificates of Analysis. Built with React, TypeScript, and Material-UI.

## Features

- View all Certificates of Analysis in a data grid
- Create new Certificates of Analysis
- View detailed information about each CoA
- Responsive design for desktop and mobile devices

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd coa-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open in your default browser at `http://localhost:3000`.

## Project Structure

```
coa-dashboard/
├── public/              # Static files
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components
│   ├── types/          # TypeScript type definitions
│   ├── services/       # API services
│   ├── App.tsx         # Main application component
│   └── index.tsx       # Application entry point
├── package.json        # Project dependencies
└── tsconfig.json      # TypeScript configuration
```

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App

## Technologies Used

- React
- TypeScript
- Material-UI
- React Router
- React Data Grid

## License

This project is licensed under the MIT License. 