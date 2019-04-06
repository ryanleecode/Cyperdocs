import { applyMiddleware, createStore, Middleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import logger from 'redux-logger';
import { createEpicMiddleware } from 'redux-observable';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage/session';
import { BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { rootEpic, rootReducer } from './store';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['document'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export function configureStore() {
  const isProd = process.env.NODE_ENV === 'production';
  const epicMiddleware = createEpicMiddleware();
  const middleware: Middleware[] = [epicMiddleware];
  if (!isProd) {
    middleware.push(logger);
  }
  const store = createStore(
    persistedReducer,
    isProd
      ? applyMiddleware(...middleware)
      : composeWithDevTools(applyMiddleware(...middleware)),
  );

  const epic$ = new BehaviorSubject(rootEpic);
  const hotReloadingEpic = (...args: any[]) =>
    epic$.pipe(switchMap((epic) => epic(...args)));

  epicMiddleware.run(hotReloadingEpic as any);
  const persistor = persistStore(store);

  if (module.hot) {
    module.hot.accept('./store', () => {
      const nextRootReducer = require('./store').rootReducer;
      store.replaceReducer(persistReducer(persistConfig, nextRootReducer));
      const nextRootEpic = require('./store').rootEpic;
      epic$.next(nextRootEpic);
    });
  }

  return { store, persistor };
}
