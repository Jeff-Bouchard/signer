import type { EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, render } from '@testing-library/react';
import { push } from 'connected-react-router';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { ThemeProvider } from 'styled-components';

import type { ApplicationState } from '@app/store';
import { selectTransaction } from '@common/store';
import { makeHistoryTx, makeQueueTx } from '@common/utils';
import { fAccount, fRequestOrigin, fTxRequest } from '@fixtures';
import { ROUTE_PATHS } from '@routing';
import { theme } from '@theme';
import type { DeepPartial } from '@types';
import { TxResult } from '@types';

import { Home } from './Home';

jest.mock('@hooks', () => ({
  ...jest.requireActual('@hooks'),
  usePersisted: jest.fn().mockReturnValue(true)
}));

const request = { origin: fRequestOrigin, request: fTxRequest };
const createMockStore = configureStore<DeepPartial<ApplicationState>>();
const queueTx = makeQueueTx(request);
const historyTx = makeHistoryTx(queueTx, TxResult.DENIED);
const mockStore = createMockStore({
  accounts: {
    accounts: [fAccount]
  },
  transactions: {
    queue: [queueTx, { ...queueTx, id: 2 }],
    history: [historyTx, historyTx]
  },
  persistence: {
    rehydratedKeys: []
  }
});

function getComponent(store: EnhancedStore<DeepPartial<ApplicationState>> = mockStore) {
  return render(
    <Router>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Home />
        </ThemeProvider>
      </Provider>
    </Router>
  );
}

describe('Home', () => {
  it('renders and allows selection of queue and history items', async () => {
    const { getAllByText, getByTestId, getAllByTestId } = getComponent();
    expect(getAllByText('WAITING ON ACTION', { exact: false })).toBeDefined();
    expect(getAllByText('DENIED', { exact: false })).toBeDefined();

    fireEvent.click(getAllByTestId('select-tx-history')[0]);
    fireEvent.click(getByTestId(`select-tx-${queueTx.id}`));

    expect(mockStore.getActions()).toContainEqual(selectTransaction(queueTx));
    expect(mockStore.getActions()).toContainEqual(selectTransaction(historyTx));
  });

  it('renders empty state', async () => {
    const { getByText } = getComponent(
      createMockStore({
        accounts: { accounts: [fAccount] },
        transactions: { queue: [], history: [] },
        persistence: { rehydratedKeys: [] }
      })
    );
    expect(
      getByText('There are no transactions in your Signer at this time', { exact: false })
    ).toBeDefined();
  });

  it('navigates to the setup page when there are no accounts', async () => {
    const store = createMockStore({
      accounts: { accounts: [] },
      transactions: { queue: [], history: [] },
      persistence: { rehydratedKeys: [] }
    });

    getComponent(store);

    expect(store.getActions()).toContainEqual(push(ROUTE_PATHS.SETUP_ACCOUNT));
  });
});
