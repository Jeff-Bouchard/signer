import type { DeepPartial, EnhancedStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import { connectRouter } from 'connected-react-router';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import { logout } from '@common/store';
import type { ApplicationState } from '@store';

import { Navigation } from './Navigation';

const history = createMemoryHistory();
const createMockStore = configureStore<DeepPartial<ApplicationState>>();

const getComponent = (store: EnhancedStore<DeepPartial<ApplicationState>> = createMockStore()) => {
  return render(
    <MemoryRouter>
      <Provider store={store}>
        <Navigation isLoggedIn={true} />
      </Provider>
    </MemoryRouter>
  );
};

describe('Navigation', () => {
  it('dispatches logout when clicking the lock button', () => {
    const mockStore = createMockStore({
      auth: {
        loggedIn: true
      },
      ui: {},
      router: connectRouter(history)(undefined, undefined)
    });

    const { getByTestId } = getComponent(mockStore);
    const lockButton = getByTestId('lock-button');

    lockButton.click();

    expect(mockStore.getActions()).toContainEqual(logout());
  });

  it('shows a back icon if navigationBack is set', () => {
    const mockStore = createMockStore({
      auth: {
        loggedIn: true
      },
      ui: {
        navigationBack: 'foo'
      },
      router: connectRouter(history)(undefined, undefined)
    });

    const { getAllByTestId } = getComponent(mockStore);
    const icon = getAllByTestId('nav-icon').find(
      (element: HTMLAnchorElement) => element.getAttribute('href') === '/foo'
    );

    expect(icon).toBeDefined();
  });
});
