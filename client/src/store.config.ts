import { applyMiddleware, createStore, Middleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createEpicMiddleware } from 'redux-observable';

import { rootEpic, rootReducer } from './store';

export function configureStore() {
  const epicMiddleware = createEpicMiddleware();
  const middleware: Middleware[] = [epicMiddleware];
  const store = createStore(
    rootReducer,
    composeWithDevTools(
      applyMiddleware(...middleware),
      // other store enhancers if any
    ),
  );

  epicMiddleware.run(rootEpic as any);

  return store;
}
