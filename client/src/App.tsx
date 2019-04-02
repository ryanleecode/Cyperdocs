import React from 'react';
import { ThemeProvider } from 'react-jss';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import Router from './Router';
import { configureStore } from './store.config';

export const Theme = {
  foregroundColor: '#FFFFFF',
  backgroundColor: '#F2F2F2',
};

const { store, persistor } = configureStore();

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <ThemeProvider theme={Theme}>
          <Router />
        </ThemeProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
);

export default App;
