import React from 'react';
import { ThemeProvider } from 'react-jss';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import Router from './Router';
import { configureStore } from './store.config';

export const Theme = {
  foregroundColor: '#FFFFFF',
  backgroundColor: '#F2F2F2',
};

const store = configureStore();

const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <ThemeProvider theme={Theme}>
        <Router />
      </ThemeProvider>
    </BrowserRouter>
  </Provider>
);

export default App;
