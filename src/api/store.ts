import type { EnhancedStore } from '@reduxjs/toolkit';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import type { BrowserWindow } from 'electron';
import createSagaMiddleware from 'redux-saga';

import { persistenceMiddleware, Process, synchronizationMiddleware } from '@common/store';
import type { ReduxIPC } from '@types';

import { createRootReducer } from './reducer';
import rootSaga from './sagas';

const reducer = createRootReducer();

export type ApplicationState = ReturnType<typeof reducer>;

export const createStore = (
  window: BrowserWindow,
  processes: Partial<Record<Process, ReduxIPC>>
): EnhancedStore<ApplicationState> => {
  const sagaMiddleware = createSagaMiddleware();

  const store = configureStore({
    reducer,
    middleware: getDefaultMiddleware({
      thunk: false,
      serializableCheck: false
    })
      .concat(synchronizationMiddleware(processes, Process.Main))
      .concat(persistenceMiddleware())
      .concat(sagaMiddleware)
  });

  sagaMiddleware.run(rootSaga, window, processes);

  return store;
};
