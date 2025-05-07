import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import AIAssistant from './components/AIAssistant';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AIAssistant />
    </ThemeProvider>
  );
};

export default App; 