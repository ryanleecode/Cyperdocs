import React from 'react';
import { ThemeProvider } from 'react-jss';
import HomePage from './HomePage';

export const Theme = {
  foregroundColor: '#FFFFFF',
  backgroundColor: '#F2F2F2',
};

const App = () => (
  <ThemeProvider theme={Theme}>
    <HomePage />
  </ThemeProvider>
);

export default App;
