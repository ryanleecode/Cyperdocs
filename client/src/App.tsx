import React from 'react';
import { ThemeProvider } from 'react-jss';
import { BrowserRouter } from 'react-router-dom';
import Router from './Router';

export const Theme = {
  foregroundColor: '#FFFFFF',
  backgroundColor: '#F2F2F2',
};

const App = () => (
  <BrowserRouter>
    <ThemeProvider theme={Theme}>
      <Router />
    </ThemeProvider>
  </BrowserRouter>
);

export default App;
